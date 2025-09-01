const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create teacher admin user
  const teacherAdminPassword = await bcrypt.hash("password123", 12);
  const teacherAdminUser = await prisma.user.create({
    data: {
      email: "teacher@institute.com",
      password: teacherAdminPassword,
      role: "ADMIN",
      teacher: {
        create: {
          firstName: "Teacher",
          lastName: "Admin",
          phone: "+1234567890",
          department: "Computer Science",
          hireDate: new Date("2020-01-15"),
        },
      },
    },
  });

  // Create teacher users
  const teacherPassword = await bcrypt.hash("teacher123", 12);
  const teacher1 = await prisma.user.create({
    data: {
      email: "john.doe@institute.com",
      password: teacherPassword,
      role: "TEACHER",
      teacher: {
        create: {
          firstName: "John",
          lastName: "Doe",
          phone: "+1234567890",
          department: "Computer Science",
          hireDate: new Date("2020-01-15"),
        },
      },
    },
  });

  const teacher2 = await prisma.user.create({
    data: {
      email: "jane.smith@institute.com",
      password: teacherPassword,
      role: "TEACHER",
      teacher: {
        create: {
          firstName: "Jane",
          lastName: "Smith",
          phone: "+1234567891",
          department: "Mathematics",
          hireDate: new Date("2019-08-20"),
        },
      },
    },
  });

  // Create student users
  const studentPassword = await bcrypt.hash("student123", 12);
  const student1 = await prisma.user.create({
    data: {
      email: "alice.johnson@student.com",
      password: studentPassword,
      role: "STUDENT",
      student: {
        create: {
          firstName: "Alice",
          lastName: "Johnson",
          phone: "+1234567892",
          address: "123 Student St, City, State",
          dateOfBirth: new Date("2000-05-15"),
          enrollmentDate: new Date("2023-09-01"),
        },
      },
    },
  });

  const student2 = await prisma.user.create({
    data: {
      email: "bob.wilson@student.com",
      password: studentPassword,
      role: "STUDENT",
      student: {
        create: {
          firstName: "Bob",
          lastName: "Wilson",
          phone: "+1234567893",
          address: "456 College Ave, City, State",
          dateOfBirth: new Date("2001-03-22"),
          enrollmentDate: new Date("2023-09-01"),
        },
      },
    },
  });

  // Create courses
  const course1 = await prisma.course.create({
    data: {
      name: "Introduction to Computer Science",
      code: "CS101",
      description: "Fundamental concepts of computer science and programming",
      credits: 3,
      teacherId: (
        await prisma.teacher.findFirst({ where: { userId: teacher1.id } })
      ).id,
      semester: "Fall",
      year: 2024,
      status: "ACTIVE",
    },
  });

  const course2 = await prisma.course.create({
    data: {
      name: "Advanced Mathematics",
      code: "MATH201",
      description: "Advanced mathematical concepts and problem solving",
      credits: 4,
      teacherId: (
        await prisma.teacher.findFirst({ where: { userId: teacher2.id } })
      ).id,
      semester: "Fall",
      year: 2024,
      status: "ACTIVE",
    },
  });

  // Create enrollments
  const student1Profile = await prisma.student.findFirst({
    where: { userId: student1.id },
  });
  const student2Profile = await prisma.student.findFirst({
    where: { userId: student2.id },
  });

  await prisma.enrollment.create({
    data: {
      studentId: student1Profile.id,
      courseId: course1.id,
      status: "ENROLLED",
    },
  });

  await prisma.enrollment.create({
    data: {
      studentId: student1Profile.id,
      courseId: course2.id,
      status: "ENROLLED",
    },
  });

  await prisma.enrollment.create({
    data: {
      studentId: student2Profile.id,
      courseId: course1.id,
      status: "ENROLLED",
    },
  });

  // Create performance records
  await prisma.performance.create({
    data: {
      studentId: student1Profile.id,
      courseId: course1.id,
      examType: "MIDTERM",
      score: 85,
      maxScore: 100,
      examDate: new Date("2024-10-15"),
      remarks: "Good understanding of basic concepts",
    },
  });

  await prisma.performance.create({
    data: {
      studentId: student1Profile.id,
      courseId: course1.id,
      examType: "FINAL",
      score: 92,
      maxScore: 100,
      examDate: new Date("2024-12-10"),
      remarks: "Excellent performance",
    },
  });

  // Create books
  await prisma.book.create({
    data: {
      title: "Introduction to Algorithms",
      author: "Thomas H. Cormen",
      isbn: "9780262033848",
      publisher: "MIT Press",
      price: 89.99,
      stock: 15,
      description: "A comprehensive guide to algorithms and data structures",
      category: "Computer Science",
      status: "ACTIVE",
    },
  });

  await prisma.book.create({
    data: {
      title: "Calculus: Early Transcendentals",
      author: "James Stewart",
      isbn: "9781285741550",
      publisher: "Cengage Learning",
      price: 199.99,
      stock: 20,
      description: "Comprehensive calculus textbook for advanced mathematics",
      category: "Mathematics",
      status: "ACTIVE",
    },
  });

  await prisma.book.create({
    data: {
      title: "The Art of Computer Programming",
      author: "Donald E. Knuth",
      isbn: "9780201896831",
      publisher: "Addison-Wesley",
      price: 79.99,
      stock: 8,
      description: "Classic computer programming reference",
      category: "Computer Science",
      status: "ACTIVE",
    },
  });

  // Create admission applications
  await prisma.admission.create({
    data: {
      firstName: "Charlie",
      lastName: "Brown",
      email: "charlie.brown@email.com",
      phone: "+1234567894",
      dateOfBirth: new Date("2002-07-10"),
      course: "Computer Science",
      status: "PENDING",
      message: "Interested in pursuing a career in software development",
    },
  });

  await prisma.admission.create({
    data: {
      firstName: "Diana",
      lastName: "Prince",
      email: "diana.prince@email.com",
      phone: "+1234567895",
      dateOfBirth: new Date("2001-11-25"),
      course: "Mathematics",
      status: "APPROVED",
      message: "Passionate about mathematics and research",
    },
  });

  // Get the actual student IDs for display
  const students = await prisma.student.findMany({
    select: { id: true, firstName: true, lastName: true },
  });

  console.log("Database seeded successfully!");
  console.log("\n=== Test Accounts ===");
  console.log("Teacher Admin: teacher@institute.com / password123");
  console.log(
    "Teachers: john.doe@institute.com / teacher123, jane.smith@institute.com / teacher123"
  );
  console.log("\n=== Student Portal Access ===");
  students.forEach((student, index) => {
    console.log(
      `Student ${index + 1}: ${student.id} (${student.firstName} ${
        student.lastName
      })`
    );
  });
  console.log(
    "\nUse the Student IDs above to login to the student performance portal"
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
