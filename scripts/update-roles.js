const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateUserRoles() {
  try {
    // Update existing TEACHER and ADMIN users to TEACHER_ADMIN
    const updatedUsers = await prisma.user.updateMany({
      where: {
        role: {
          in: ['TEACHER', 'ADMIN']
        }
      },
      data: {
        role: 'TEACHER_ADMIN'
      }
    });

    console.log(`Successfully updated ${updatedUsers.count} users to TEACHER_ADMIN role`);
  } catch (error) {
    console.error('Error updating user roles:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateUserRoles();