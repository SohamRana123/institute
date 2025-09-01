const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function updatePassword() {
  try {
    // Create a simple password for testing
    const testPassword = 'password123';
    const hashedPassword = await bcrypt.hash(testPassword, 12);
    
    // Check if the teacher admin exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'teacher@institute.com' },
      include: { teacher: true }
    });
    
    if (existingUser) {
      // Update existing teacher admin
      await prisma.user.update({
        where: { email: 'teacher@institute.com' },
        data: { password: hashedPassword }
      });
      console.log('Teacher admin password updated successfully');
      console.log('Login credentials:');
      console.log('Email: teacher@institute.com');
      console.log('Password: ' + testPassword);
    } else {
      // Create new teacher admin if it doesn't exist
      const newUser = await prisma.user.create({
        data: {
          email: 'teacher@institute.com',
          password: hashedPassword,
          name: 'Test Teacher Admin',
          role: 'TEACHER',
          teacher: {
            create: {
              department: 'Computer Science',
              isAdmin: true,
              status: 'APPROVED'
            }
          }
        }
      });
      console.log('New teacher admin created successfully');
      console.log('Login credentials:');
      console.log('Email: teacher@institute.com');
      console.log('Password: ' + testPassword);
    }
  } catch (error) {
    console.error('Error updating/creating teacher admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updatePassword();