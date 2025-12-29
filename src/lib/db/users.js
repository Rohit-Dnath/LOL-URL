import { prisma } from './prisma';

/**
 * User Operations
 */

export async function getUserById(id) {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      workspaces: {
        include: {
          workspace: true
        }
      }
    }
  });
}

export async function getUserByEmail(email) {
  return await prisma.user.findUnique({
    where: { email },
  });
}

export async function updateUser(id, data) {
  return await prisma.user.update({
    where: { id },
    data,
  });
}

export async function deleteUser(id) {
  return await prisma.user.delete({
    where: { id },
  });
}
