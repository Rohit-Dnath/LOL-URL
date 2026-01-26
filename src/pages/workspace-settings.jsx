import { useState, useEffect } from "react";
import { UrlState } from "@/context";
import { useNavigate } from "react-router-dom";
import { WorkspaceSwitcher } from "@/components/workspace-switcher";
import {
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
  getWorkspaceMembers,
  updateMemberRole,
  removeMember,
  getWorkspaceInvites,
  cancelInvite,
} from "@/db/apiWorkspaces";
import supabase from "@/db/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { InviteModal } from "@/components/invite-modal";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";
import { toastConfig } from "@/utils/toastConfig";
import { 
  Settings, 
  Users, 
  Mail, 
  UserPlus, 
  Trash2, 
  Crown,
  Shield,
  Edit,
  Eye,
  X,
  AlertTriangle,
  Briefcase
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatDistanceToNow } from "date-fns";

const roleIcons = {
  owner: Crown,
  admin: Shield,
  editor: Edit,
  viewer: Eye,
};

const roleColors = {
  owner: "text-yellow-500",
  admin: "text-blue-500",
  editor: "text-green-500",
  viewer: "text-gray-500",
};

export default function WorkspaceSettings() {
  const { currentWorkspace, user, fetchWorkspaces, setCurrentWorkspace, workspaces } = UrlState();
  const navigate = useNavigate();
  
  const [workspace, setWorkspace] = useState(null);
  const [members, setMembers] = useState([]);
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(false); // Start with false, will set true when loading
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    // If currentWorkspace is available, load its data
    if (currentWorkspace?.id) {
      loadWorkspaceData();
    } else {
      // No workspace selected - show empty state
      setWorkspace(null);
      setMembers([]);
      setInvites([]);
      setLoading(false);
    }
  }, [currentWorkspace?.id]);

  // Initialize form data when workspace data is available
  useEffect(() => {
    if (workspace) {
      setFormData({
        name: workspace.name || "",
        description: workspace.description || "",
      });
    } else if (currentWorkspace && !loading) {
      // Fallback to currentWorkspace if workspace data hasn't loaded yet
      setFormData({
        name: currentWorkspace.name || "",
        description: currentWorkspace.description || "",
      });
    }
  }, [workspace, currentWorkspace, loading]);

  const loadWorkspaceData = async () => {
    if (!currentWorkspace?.id) return;
    
    try {
      setLoading(true);
      const [workspaceData, membersData, invitesData] = await Promise.all([
        getWorkspaceById(currentWorkspace.id),
        getWorkspaceMembers(currentWorkspace.id),
        getWorkspaceInvites(currentWorkspace.id),
      ]);

      console.log('Loaded workspace data:', workspaceData);
      console.log('Loaded members data:', membersData);

      setWorkspace(workspaceData);
      // Use membersData from getWorkspaceMembers which has proper profiles data
      setMembers(membersData || workspaceData.workspace_members || []);
      setInvites(invitesData || []);
      setFormData({
        name: workspaceData.name,
        description: workspaceData.description || "",
      });
    } catch (error) {
      console.error("Error loading workspace data:", error);
      toast.error("Failed to load workspace settings", toastConfig);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateWorkspace = async () => {
    try {
      await updateWorkspace(currentWorkspace.id, formData);
      toast.success("Workspace updated successfully!", toastConfig);
      await fetchWorkspaces();
      await loadWorkspaceData();
    } catch (error) {
      console.error("Error updating workspace:", error);
      toast.error("Failed to update workspace", toastConfig);
    }
  };

  const handleDeleteWorkspace = async () => {
    try {
      await deleteWorkspace(currentWorkspace.id);
      toast.success("Workspace deleted successfully!", toastConfig);
      setCurrentWorkspace(null);
      await fetchWorkspaces();
      navigate("/dashboard");
    } catch (error) {
      console.error("Error deleting workspace:", error);
      toast.error("Failed to delete workspace", toastConfig);
    }
  };

  const handleUpdateRole = async (memberId, newRole) => {
    try {
      await updateMemberRole(memberId, newRole);
      toast.success("Member role updated!", toastConfig);
      await loadWorkspaceData();
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update role", toastConfig);
    }
  };

  const handleRemoveMember = async (memberId, isSelfRemoval = false) => {
    try {
      await removeMember(memberId);
      
      if (isSelfRemoval) {
        toast.success("You've left the workspace", toastConfig);
        // Clear current workspace and redirect
        setCurrentWorkspace(null);
        await fetchWorkspaces();
        navigate("/dashboard");
      } else {
        toast.success("Member removed from workspace!", toastConfig);
        await loadWorkspaceData();
      }
    } catch (error) {
      console.error("Error removing member:", error);
      toast.error("Failed to remove member", toastConfig);
    }
  };

  const confirmRemoveMember = (member) => {
    const isSelf = member.user_id === user?.id;
    setMemberToRemove(member);
    setShowLeaveDialog(true);
  };

  const handleCancelInvite = async (inviteId) => {
    try {
      await cancelInvite(inviteId);
      toast.success("Invite cancelled!", toastConfig);
      await loadWorkspaceData();
    } catch (error) {
      console.error("Error cancelling invite:", error);
      toast.error("Failed to cancel invite", toastConfig);
    }
  };

  const isOwner = (workspace?.owner_id || currentWorkspace?.owner_id) === user?.id;
  const currentUserMember = members.find(m => m.user_id === user?.id);
  const isAdmin = currentUserMember?.role === 'admin';
  const canEditWorkspace = isOwner || isAdmin; // Owner and admin can edit workspace info
  const canManageMembers = isOwner; // Only owner can remove/manage other members

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <BeatLoader color="hsl(var(--primary))" />
      </div>
    );
  }

  // Only show empty state if NO workspace is selected (currentWorkspace is null)
  if (!currentWorkspace) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Card className="rounded-xl border-border/50 shadow-lg">
          <CardHeader className="text-center py-12">
            <Briefcase className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <CardTitle className="text-2xl">Select a Workspace</CardTitle>
            <CardDescription className="text-lg mt-2 mb-8">
              Workspace settings are only available for team workspaces.
              Personal links don't require workspace management.
            </CardDescription>
            
            {/* Workspace Switcher in the empty state */}
            <div className="flex flex-col items-center gap-4 mt-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Select a team workspace:</span>
                <WorkspaceSwitcher />
              </div>
              
              {workspaces.length === 0 && (
                <p className="text-sm text-muted-foreground mt-4">
                  You don't have any team workspaces yet. Create one to start collaborating!
                </p>
              )}
            </div>
          </CardHeader>
          <CardContent className="text-center pb-12">
            <Button 
              onClick={() => navigate("/dashboard")}
              variant="outline"
              className="rounded-xl"
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Use workspace data if loaded, or fall back to currentWorkspace for display
  const displayWorkspace = workspace || currentWorkspace;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">{displayWorkspace.name}</h1>
          <p className="text-muted-foreground">Manage workspace settings and members</p>
        </div>
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3">
          <Button 
            onClick={() => setShowInviteModal(true)} 
            className="rounded-xl bg-gradient-to-r from-primary to-primary/90"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Invite Members
          </Button>
          <div className="flex flex-col items-start sm:items-end gap-1">
            <span className="text-xs text-muted-foreground">Current Workspace</span>
            <WorkspaceSwitcher />
          </div>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 rounded-xl">
          <TabsTrigger value="general" className="rounded-lg">
            <Settings className="w-4 h-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="members" className="rounded-lg">
            <Users className="w-4 h-4 mr-2" />
            Members ({members.length})
          </TabsTrigger>
          <TabsTrigger value="invites" className="rounded-lg">
            <Mail className="w-4 h-4 mr-2" />
            Invites ({invites.filter(i => i.status === 'pending').length})
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card className="rounded-xl border-border/50">
            <CardHeader>
              <CardTitle>Workspace Information</CardTitle>
              <CardDescription>Update your workspace details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="workspace-name">Workspace Name</Label>
                <Input
                  id="workspace-name"
                  value={formData.name || displayWorkspace?.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!canEditWorkspace}
                  className="rounded-xl"
                  placeholder="Enter workspace name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="workspace-description">Description</Label>
                <Input
                  id="workspace-description"
                  value={formData.description || displayWorkspace?.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  disabled={!canEditWorkspace}
                  className="rounded-xl"
                  placeholder="Enter workspace description"
                />
              </div>

              {canEditWorkspace && (
                <Button 
                  onClick={handleUpdateWorkspace}
                  className="rounded-xl"
                >
                  Save Changes
                </Button>
              )}

              {isOwner && (
                <div className="pt-6 mt-6 border-t border-destructive/20">
                  <h3 className="text-lg font-semibold text-destructive mb-2">Danger Zone</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Once you delete a workspace, there is no going back. All links will be moved to personal workspace.
                  </p>
                  <Button
                    variant="destructive"
                    onClick={() => setShowDeleteDialog(true)}
                    className="rounded-xl text-white hover:text-white"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Workspace
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Members Tab */}
        <TabsContent value="members">
          <Card className="rounded-xl border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>Manage who has access to this workspace</CardDescription>
                </div>
                <Button onClick={() => setShowInviteModal(true)} className="rounded-xl">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Invite Member
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {members.map((member) => {
                  const RoleIcon = roleIcons[member.role];
                  const roleColor = roleColors[member.role];
                  const isSelf = member.user_id === user?.id;
                  const userProfile = member.profiles;
                  const email = userProfile?.email || 'Unknown';
                  const name = userProfile?.name || email.split('@')[0];
                  
                  return (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-muted/30 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          {userProfile?.avatar_url && (
                            <AvatarImage 
                              src={userProfile.avatar_url} 
                              alt={name}
                              className="object-cover"
                            />
                          )}
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {name[0]?.toUpperCase()}{name.split(' ')[1]?.[0]?.toUpperCase() || ''}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {name} {isSelf && <span className="text-xs text-muted-foreground">(You)</span>}
                          </p>
                          <p className="text-sm text-muted-foreground">{email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {canManageMembers && !isSelf && member.role !== 'owner' ? (
                          <Select
                            value={member.role}
                            onValueChange={(newRole) => handleUpdateRole(member.id, newRole)}
                          >
                            <SelectTrigger className="w-[140px] rounded-lg">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="editor">Editor</SelectItem>
                              <SelectItem value="viewer">Viewer</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 ${roleColor}`}>
                            <RoleIcon className="w-4 h-4" />
                            <span className="text-sm font-medium capitalize">{member.role}</span>
                          </div>
                        )}

                        {/* Only owner can remove other members, anyone can leave themselves */}
                        {((isOwner && !isSelf && member.role !== 'owner') || isSelf) && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => confirmRemoveMember(member)}
                            className="rounded-lg hover:bg-destructive/10 hover:text-destructive"
                            title={isSelf ? "Leave workspace" : "Remove member"}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Invites Tab */}
        <TabsContent value="invites">
          <Card className="rounded-xl border-border/50">
            <CardHeader>
              <CardTitle>Pending Invitations</CardTitle>
              <CardDescription>Manage workspace invitations</CardDescription>
            </CardHeader>
            <CardContent>
              {invites.filter(i => i.status === 'pending').length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Mail className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="mb-4">No pending invites</p>
                  <Button 
                    onClick={() => setShowInviteModal(true)} 
                    variant="outline"
                    className="rounded-xl"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Invite Someone
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {invites
                    .filter(i => i.status === 'pending')
                    .map((invite) => (
                      <div
                        key={invite.id}
                        className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-muted/30 transition-all"
                      >
                        <div>
                          <p className="font-medium">{invite.email || "Shareable link"}</p>
                          <p className="text-sm text-muted-foreground">
                            Expires {formatDistanceToNow(new Date(invite.expires_at), { addSuffix: true })}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-sm text-muted-foreground capitalize px-3 py-1 rounded-lg bg-muted/50">
                            {invite.role}
                          </span>
                          {canManageMembers && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleCancelInvite(invite.id)}
                              className="rounded-lg hover:bg-destructive/10 hover:text-destructive"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Invite Modal */}
      <InviteModal
        open={showInviteModal}
        onOpenChange={(open) => {
          setShowInviteModal(open);
          if (!open) loadWorkspaceData();
        }}
        workspace={workspace}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Delete Workspace?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the workspace
              <span className="font-semibold"> "{displayWorkspace?.name}"</span> and move all links to your personal workspace.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteWorkspace}
              className="rounded-xl bg-destructive hover:bg-destructive/90"
            >
              Delete Workspace
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Leave/Remove Member Confirmation Dialog */}
      <AlertDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <AlertDialogContent className="rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              {memberToRemove?.user_id === user?.id ? "Leave Workspace?" : "Remove Member?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {memberToRemove?.user_id === user?.id ? (
                <>
                  Are you sure you want to leave <span className="font-semibold">"{displayWorkspace?.name}"</span>?
                  {memberToRemove?.role === 'owner' && (
                    <span className="block mt-2 text-amber-600 dark:text-amber-400 font-medium">
                      ⚠️ As the owner, leaving will remove your ownership. Make sure to transfer ownership first if you want someone else to manage the workspace.
                    </span>
                  )}
                </>
              ) : (
                <>
                  Remove <span className="font-semibold">{memberToRemove?.profiles?.name || memberToRemove?.profiles?.email}</span> from the workspace?
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl" onClick={() => setMemberToRemove(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                handleRemoveMember(memberToRemove.id, memberToRemove?.user_id === user?.id);
                setShowLeaveDialog(false);
                setMemberToRemove(null);
              }}
              className="rounded-xl bg-destructive hover:bg-destructive/90"
            >
              {memberToRemove?.user_id === user?.id ? "Leave Workspace" : "Remove Member"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
