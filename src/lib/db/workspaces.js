import { prisma } from './prisma';
import { nanoid } from 'nanoid';

/**
 * Workspace & Team Collaboration Operations
 */

// Create workspace
export async function createWorkspace({ name, slug, userId }) {
  // Check if slug is available
  const existing = await prisma.workspace.findUnique({
    where: { slug }
  });

  if (existing) {
    throw new Error('Workspace slug already taken');
  }

  return await prisma.workspace.create({
    data: {
      name,
      slug,
      members: {
        create: {
          userId,
          role: 'OWNER'
        }
      }
    },
    include: {
      members: {
        include: {
          user: {
            select: { id: true, name: true, email: true, image: true }
          }
        }
      }
    }
  });
}

// Get user's workspaces
export async function getUserWorkspaces(userId) {
  return await prisma.workspaceMember.findMany({
    where: { userId },
    include: {
      workspace: {
        include: {
          _count: {
            select: { urls: true, members: true }
          }
        }
      }
    },
    orderBy: {
      createdAt: 'asc'
    }
  });
}

// Get workspace by ID or slug
export async function getWorkspace(identifier, userId = null) {
  const where = identifier.startsWith('ws_') 
    ? { id: identifier }
    : { slug: identifier };

  const workspace = await prisma.workspace.findUnique({
    where,
    include: {
      members: {
        include: {
          user: {
            select: { id: true, name: true, email: true, image: true }
          }
        }
      },
      _count: {
        select: { urls: true }
      }
    }
  });

  // Check if user has access
  if (userId && workspace) {
    const member = workspace.members.find(m => m.userId === userId);
    if (!member) {
      throw new Error('Access denied');
    }
  }

  return workspace;
}

// Update workspace
export async function updateWorkspace(workspaceId, userId, data) {
  // Check permissions
  const member = await prisma.workspaceMember.findUnique({
    where: {
      userId_workspaceId: { userId, workspaceId }
    }
  });

  if (!member || (member.role !== 'OWNER' && member.role !== 'ADMIN')) {
    throw new Error('Insufficient permissions');
  }

  return await prisma.workspace.update({
    where: { id: workspaceId },
    data
  });
}

// Delete workspace
export async function deleteWorkspace(workspaceId, userId) {
  // Only owner can delete
  const member = await prisma.workspaceMember.findUnique({
    where: {
      userId_workspaceId: { userId, workspaceId }
    }
  });

  if (!member || member.role !== 'OWNER') {
    throw new Error('Only workspace owner can delete');
  }

  return await prisma.workspace.delete({
    where: { id: workspaceId }
  });
}

// Check user permissions
export async function hasPermission(userId, workspaceId, action) {
  const member = await prisma.workspaceMember.findUnique({
    where: {
      userId_workspaceId: { userId, workspaceId }
    }
  });

  if (!member) return false;

  const permissions = {
    OWNER: ['read', 'write', 'delete', 'invite', 'billing', 'manage'],
    ADMIN: ['read', 'write', 'delete', 'invite'],
    MEMBER: ['read', 'write'],
    VIEWER: ['read']
  };

  return permissions[member.role]?.includes(action) ?? false;
}

// Create invitation
export async function createInvitation({
  email,
  workspaceId,
  invitedBy,
  role = 'MEMBER'
}) {
  // Check if inviter has permission
  const canInvite = await hasPermission(invitedBy, workspaceId, 'invite');
  if (!canInvite) {
    throw new Error('Insufficient permissions to invite');
  }

  // Check if user already invited
  const existing = await prisma.invitation.findFirst({
    where: {
      email,
      workspaceId,
      acceptedAt: null
    }
  });

  if (existing) {
    throw new Error('User already invited');
  }

  const token = nanoid(32);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

  return await prisma.invitation.create({
    data: {
      email,
      workspaceId,
      invitedBy,
      role,
      token,
      expiresAt
    },
    include: {
      workspace: true,
      inviter: {
        select: { name: true, email: true }
      }
    }
  });
}

// Accept invitation
export async function acceptInvitation(token, userId) {
  const invitation = await prisma.invitation.findUnique({
    where: { token },
    include: { workspace: true }
  });

  if (!invitation) {
    throw new Error('Invalid invitation');
  }

  if (invitation.acceptedAt) {
    throw new Error('Invitation already accepted');
  }

  if (invitation.expiresAt < new Date()) {
    throw new Error('Invitation expired');
  }

  // Get user email
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (user.email !== invitation.email) {
    throw new Error('This invitation is for a different email');
  }

  // Add user to workspace
  await prisma.workspaceMember.create({
    data: {
      userId,
      workspaceId: invitation.workspaceId,
      role: invitation.role
    }
  });

  // Mark invitation as accepted
  await prisma.invitation.update({
    where: { id: invitation.id },
    data: { acceptedAt: new Date() }
  });

  return invitation.workspace;
}

// Remove member from workspace
export async function removeMember(workspaceId, userId, memberIdToRemove) {
  // Check permissions
  const canManage = await hasPermission(userId, workspaceId, 'manage');
  if (!canManage) {
    throw new Error('Insufficient permissions');
  }

  // Can't remove owner
  const memberToRemove = await prisma.workspaceMember.findUnique({
    where: {
      userId_workspaceId: { userId: memberIdToRemove, workspaceId }
    }
  });

  if (memberToRemove?.role === 'OWNER') {
    throw new Error('Cannot remove workspace owner');
  }

  return await prisma.workspaceMember.delete({
    where: {
      userId_workspaceId: { userId: memberIdToRemove, workspaceId }
    }
  });
}

// Update member role
export async function updateMemberRole(workspaceId, userId, memberIdToUpdate, newRole) {
  // Only owner can change roles
  const member = await prisma.workspaceMember.findUnique({
    where: {
      userId_workspaceId: { userId, workspaceId }
    }
  });

  if (!member || member.role !== 'OWNER') {
    throw new Error('Only owner can change roles');
  }

  // Can't change owner role
  const memberToUpdate = await prisma.workspaceMember.findUnique({
    where: {
      userId_workspaceId: { userId: memberIdToUpdate, workspaceId }
    }
  });

  if (memberToUpdate?.role === 'OWNER') {
    throw new Error('Cannot change owner role');
  }

  return await prisma.workspaceMember.update({
    where: {
      userId_workspaceId: { userId: memberIdToUpdate, workspaceId }
    },
    data: { role: newRole }
  });
}
