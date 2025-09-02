const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Checking users in the database...');
    
    // Get all users
    const users = await prisma.user.findMany();

    
    console.log(`Found ${users.length} users:`);
    users.forEach(user => {
      console.log(`- ID: ${user.id}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Role: ${user.role}`);
      console.log(`  Password hash: ${user.password ? user.password.substring(0, 20) + '...' : 'none'}`);
      console.log(`  Created: ${user.createdAt}`);
      console.log('---');
    });
    
    // If no users exist, create a test user
    if (users.length === 0) {
      console.log('No users found. Creating a test user...');
      
      // Import the bcrypt module for password hashing
      const bcrypt = require('bcrypt');
      
      // Hash the password
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      // Create a test user
      const newUser = await prisma.user.create({
        data: {
          email: 'teacher@example.com',
          password: hashedPassword,
          role: 'TEACHER',
          teacher: {
            create: {
              firstName: 'Test',
              lastName: 'Teacher'
            }
          }
        }
      });
      
      console.log('Created test user:');
      console.log(`- ID: ${newUser.id}`);
      console.log(`  Email: ${newUser.email}`);
      console.log(`  Role: ${newUser.role}`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();