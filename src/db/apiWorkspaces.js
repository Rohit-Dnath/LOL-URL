import supabase from "./supabase";
import { v4 as uuidv4 } from 'uuid';

// Create a new workspace
export async function createWorkspace({ name, description, user_id }) {
  console.log("Creating workspace with:", { name, description, user_id });
  
  const { data, error } = await supabase
    .from("workspaces")
    .insert([{ name, description, owner_id: user_id }])
    .select();

  if (error) {
    console.error("Error creating workspace:", error);
    console.error("Error details:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    });
    throw new Error(error.message || "Unable to create workspace");
  }

  console.log("Workspace created successfully:", data);
  return data;
}

// Get all workspaces for a user (owned + member)
export async function getUserWorkspaces(user_id) {
  // First get workspaces where user is owner
  const { data: ownedWorkspaces, error: ownedError } = await supabase
    .from("workspaces")
    .select("*, workspace_members(role)")
    .eq("owner_id", user_id);

  if (ownedError) {
    console.error("Error fetching owned workspaces:", ownedError);
    throw new Error("Unable to load workspaces");
  }

  // Then get workspaces where user is a member (but not owner)
  const { data: memberWorkspaces, error: memberError } = await supabase
    .from("workspace_members")
    .select(`
      role,
      workspaces(*)
    `)
    .eq("user_id", user_id);

  if (memberError) {
    console.error("Error fetching member workspaces:", memberError);
    throw new Error("Unable to load workspaces");
  }

  // Combine and deduplicate
  const allWorkspaces = [...(ownedWorkspaces || [])];
  
  // Add member workspaces that aren't already owned
  memberWorkspaces?.forEach(membership => {
    if (membership.workspaces && !allWorkspaces.find(w => w.id === membership.workspaces.id)) {
      allWorkspaces.push({
        ...membership.workspaces,
        workspace_members: [{ role: membership.role }]
      });
    }
  });

  return allWorkspaces;
}

// Get workspace by ID with details
export async function getWorkspaceById(workspace_id) {
  const { data, error } = await supabase
    .from("workspaces")
    .select(`
      *,
      workspace_members(
        id,
        user_id,
        role,
        joined_at,
        profiles (
          email,
          name,
          avatar_url
        )
      )
    `)
    .eq("id", workspace_id)
    .single();

  if (error) {
    console.error("Error fetching workspace:", error);
    throw new Error("Unable to load workspace");
  }

  return data;
}

// Update workspace
export async function updateWorkspace(workspace_id, { name, description }) {
  const { data, error } = await supabase
    .from("workspaces")
    .update({ name, description, updated_at: new Date().toISOString() })
    .eq("id", workspace_id)
    .select();

  if (error) {
    console.error("Error updating workspace:", error);
    throw new Error("Unable to update workspace");
  }

  return data;
}

// Delete workspace
export async function deleteWorkspace(workspace_id) {
  const { error } = await supabase
    .from("workspaces")
    .delete()
    .eq("id", workspace_id);

  if (error) {
    console.error("Error deleting workspace:", error);
    throw new Error("Unable to delete workspace");
  }
}

// Get workspace members
export async function getWorkspaceMembers(workspace_id) {
  console.log('Fetching members for workspace:', workspace_id);
  
  // First, get the workspace members
  const { data: members, error: membersError } = await supabase
    .from("workspace_members")
    .select("*")
    .eq("workspace_id", workspace_id);

  if (membersError) {
    console.error("Error fetching members:", membersError);
    throw new Error("Unable to load members");
  }

  if (!members || members.length === 0) {
    console.log('No members found');
    return [];
  }

  // Get all user_ids
  const userIds = members.map(m => m.user_id);
  
  // Fetch profiles for these users
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, email, name, avatar_url")
    .in("id", userIds);

  if (profilesError) {
    console.error("Error fetching profiles:", profilesError);
    // Continue without profiles
  }

  // Create a map of user_id to profile
  const profilesMap = {};
  (profiles || []).forEach(p => {
    profilesMap[p.id] = p;
  });

  // Combine members with their profiles
  const membersWithProfiles = members.map(member => ({
    ...member,
    profiles: profilesMap[member.user_id] || null
  }));

  console.log('Fetched members with profiles:', membersWithProfiles);
  return membersWithProfiles;
}

// Add member to workspace by email
export async function addMemberByEmail(workspace_id, email, role = 'editor') {
  // Find user by email using profiles table
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .single();

  if (profileError || !profile) {
    throw new Error("User with this email not found");
  }

  // Check if already a member
  const { data: existing } = await supabase
    .from("workspace_members")
    .select("*")
    .eq("workspace_id", workspace_id)
    .eq("user_id", profile.id)
    .single();

  if (existing) {
    throw new Error("User is already a member of this workspace");
  }

  // Add member using RPC function (bypasses RLS with SECURITY DEFINER)
  const { data, error } = await supabase
    .rpc('add_workspace_member', {
      p_workspace_id: workspace_id,
      p_user_id: profile.id,
      p_role: role
    });

  if (error) {
    console.error("Error adding member:", error);
    throw new Error("Unable to add member");
  }

  // Fetch the created member record
  const { data: memberData, error: fetchError } = await supabase
    .from("workspace_members")
    .select(`
      *,
      profiles (
        id,
        email,
        name,
        avatar_url
      )
    `)
    .eq("workspace_id", workspace_id)
    .eq("user_id", profile.id)
    .single();

  if (fetchError) {
    console.error("Error fetching member:", fetchError);
  }

  return memberData || data;
}

// Update member role
export async function updateMemberRole(member_id, role) {
  const { data, error } = await supabase
    .from("workspace_members")
    .update({ role })
    .eq("id", member_id)
    .select();

  if (error) {
    console.error("Error updating member role:", error);
    throw new Error("Unable to update member role");
  }

  return data;
}

// Remove member from workspace
export async function removeMember(member_id) {
  const { error } = await supabase
    .from("workspace_members")
    .delete()
    .eq("id", member_id);

  if (error) {
    console.error("Error removing member:", error);
    throw new Error("Unable to remove member");
  }
}

// Create workspace invite
export async function createInvite(workspace_id, email, role, invited_by, expiresInDays = 7) {
  const invite_token = uuidv4();
  const expires_at = new Date();
  expires_at.setDate(expires_at.getDate() + expiresInDays);

  const { data, error } = await supabase
    .from("workspace_invites")
    .insert([{
      workspace_id,
      email,
      invite_token,
      invited_by,
      role,
      expires_at: expires_at.toISOString()
    }])
    .select();

  if (error) {
    console.error("Error creating invite:", error);
    throw new Error("Unable to create invite");
  }

  return data[0];
}

// Get invite by token
export async function getInviteByToken(invite_token) {
  const { data, error } = await supabase
    .from("workspace_invites")
    .select(`
      *,
      workspaces(name, description, owner_id)
    `)
    .eq("invite_token", invite_token)
    .single();

  if (error) {
    console.error("Error fetching invite:", error);
    throw new Error("Invalid or expired invite");
  }

  return data;
}

// Accept invite - uses a dedicated RPC function that validates invite token
export async function acceptInvite(invite_token, user_id) {
  // First validate the invite exists and is valid
  const invite = await getInviteByToken(invite_token);

  if (invite.status !== 'pending') {
    throw new Error("This invite has already been used");
  }

  if (new Date(invite.expires_at) < new Date()) {
    throw new Error("This invite has expired");
  }

  // Use the dedicated accept_workspace_invite RPC function
  // This function handles all the logic with SECURITY DEFINER
  const { error: acceptError } = await supabase
    .rpc('accept_workspace_invite', {
      p_invite_token: invite_token,
      p_user_id: user_id
    });

  if (acceptError) {
    console.error("Error accepting invite:", acceptError);
    throw new Error(acceptError.message || "Unable to join workspace");
  }

  // Fetch the created member record to return
  const { data: memberData, error: fetchError } = await supabase
    .from("workspace_members")
    .select(`
      *,
      profiles (
        id,
        email,
        name,
        avatar_url
      )
    `)
    .eq("workspace_id", invite.workspace_id)
    .eq("user_id", user_id)
    .single();

  if (fetchError) {
    console.error("Error fetching member:", fetchError);
  }

  return memberData;
}

// Get workspace invites
export async function getWorkspaceInvites(workspace_id) {
  const { data, error } = await supabase
    .from("workspace_invites")
    .select("*")
    .eq("workspace_id", workspace_id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching invites:", error);
    throw new Error("Unable to load invites");
  }

  return data;
}

// Cancel/delete invite
export async function cancelInvite(invite_id) {
  const { error } = await supabase
    .from("workspace_invites")
    .delete()
    .eq("id", invite_id);

  if (error) {
    console.error("Error canceling invite:", error);
    throw new Error("Unable to cancel invite");
  }
}

// Get workspace stats
export async function getWorkspaceStats(workspace_id) {
  const { data, error } = await supabase
    .rpc('get_workspace_stats', { workspace_id_param: workspace_id });

  if (error) {
    console.error("Error fetching workspace stats:", error);
    return { member_count: 0, url_count: 0, total_clicks: 0 };
  }

  return data[0] || { member_count: 0, url_count: 0, total_clicks: 0 };
}
