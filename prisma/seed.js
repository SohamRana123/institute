const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Check if teacher admin user exists
  let teacherAdminUser = await prisma.user.findUnique({
    where: { email: "teacher@institute.com" },
  });

  if (!teacherAdminUser) {
    // Create teacher admin user
    const teacherAdminPassword = await bcrypt.hash("password123", 12);
    teacherAdminUser = await prisma.user.create({
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
  }

  // Check if teacher1 exists
  let teacher1 = await prisma.user.findUnique({
    where: { email: "john.doe@institute.com" },
  });

  if (!teacher1) {
    // Create teacher users
    const teacherPassword = await bcrypt.hash("teacher123", 12);
    teacher1 = await prisma.user.create({
      data: {
        email: "john.doe@institute.com",
        password: teacherPassword,
        role: "ADMIN",
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
  }

  // Check if teacher2 exists
  let teacher2 = await prisma.user.findUnique({
    where: { email: "jane.smith@institute.com" },
  });

  if (!teacher2) {
    const teacherPassword = await bcrypt.hash("teacher123", 12);
    teacher2 = await prisma.user.create({
      data: {
        email: "jane.smith@institute.com",
        password: teacherPassword,
        role: "ADMIN",
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
  }

  // Check if student1 exists
  let student1 = await prisma.user.findUnique({
    where: { email: "alice.johnson@student.com" },
  });

  if (!student1) {
    // Create student users
    const studentPassword = await bcrypt.hash("student123", 12);
    student1 = await prisma.user.create({
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
  }

  // Check if student2 exists
  let student2 = await prisma.user.findUnique({
    where: { email: "bob.wilson@student.com" },
  });

  if (!student2) {
    const studentPassword = await bcrypt.hash("student123", 12);
    student2 = await prisma.user.create({
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
  }

  // Get student profiles
  const student1Profile = await prisma.student.findFirst({
    where: { userId: student1.id },
  });
  const student2Profile = await prisma.student.findFirst({
    where: { userId: student2.id },
  });

  // Check if course1 exists
  let course1 = await prisma.course.findFirst({
    where: { code: "CS101" },
  });

  if (!course1) {
    // Create courses
    course1 = await prisma.course.create({
      data: {
        name: "Introduction to Computer Science",
        code: "CS101",
        description:
          "Fundamental concepts of computer science and programming",
        credits: 3,
        teacherId: (
          await prisma.teacher.findFirst({ where: { userId: teacher1.id } })
        ).id,
        semester: "Fall",
        year: 2024,
        status: "ACTIVE",
      },
    });
  }

  // Check if course2 exists
  let course2 = await prisma.course.findFirst({
    where: { code: "MATH201" },
  });

  if (!course2) {
    course2 = await prisma.course.create({
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
  }

  // Check if enrollment1 exists
  const existingEnrollment1 = await prisma.enrollment.findFirst({
    where: {
      studentId: student1Profile.id,
      courseId: course1.id,
    },
  });

  if (!existingEnrollment1) {
    await prisma.enrollment.create({
      data: {
        studentId: student1Profile.id,
        courseId: course1.id,
        status: "ENROLLED",
      },
    });
  }

  // Check if enrollment2 exists
  const existingEnrollment2 = await prisma.enrollment.findFirst({
    where: {
      studentId: student1Profile.id,
      courseId: course2.id,
    },
  });

  if (!existingEnrollment2) {
    await prisma.enrollment.create({
      data: {
        studentId: student1Profile.id,
        courseId: course2.id,
        status: "ENROLLED",
      },
    });
  }

  // Check if enrollment3 exists
  const existingEnrollment3 = await prisma.enrollment.findFirst({
    where: {
      studentId: student2Profile.id,
      courseId: course1.id,
    },
  });

  if (!existingEnrollment3) {
    await prisma.enrollment.create({
      data: {
        studentId: student2Profile.id,
        courseId: course1.id,
        status: "ENROLLED",
      },
    });
  }

  // Check if performance1 exists
  const existingPerformance1 = await prisma.performance.findFirst({
    where: {
      studentId: student1Profile.id,
      courseId: course1.id,
      examType: "MIDTERM",
    },
  });

  if (!existingPerformance1) {
    await prisma.performance.create({
      data: {
        studentId: student1Profile.id,
        courseId: course1.id,
        examType: "MIDTERM",
        score: 85,
        maxScore: 100,
        examDate: new Date("2024-03-15"),
        remarks: "Good understanding of basic concepts",
      },
    });
  }

  // Check if performance2 exists
  const existingPerformance2 = await prisma.performance.findFirst({
    where: {
      studentId: student1Profile.id,
      courseId: course1.id,
      examType: "FINAL",
    },
  });

  if (!existingPerformance2) {
    await prisma.performance.create({
      data: {
        studentId: student1Profile.id,
        courseId: course1.id,
        examType: "FINAL",
        score: 92,
        maxScore: 100,
        examDate: new Date("2024-06-10"),
        remarks: "Excellent performance",
      },
    });
  }

  // Check if book1 exists
  const existingBook1 = await prisma.book.findFirst({
    where: { isbn: "9780262033848" },
  });

  if (!existingBook1) {
    await prisma.book.create({
      data: {
        title: "Introduction to Algorithms",
        author: "Thomas H. Cormen",
        isbn: "9780262033848",
        price: 89.99,
        stock: 15,
        category: "TEXTBOOK",
      },
    });
  }

  // Check if book2 exists
  const existingBook2 = await prisma.book.findFirst({
    where: { isbn: "9781285741550" },
  });

  if (!existingBook2) {
    await prisma.book.create({
      data: {
        title: "Calculus: Early Transcendentals",
        author: "James Stewart",
        isbn: "9781285741550",
        price: 75.50,
        stock: 20,
        category: "TEXTBOOK",
      },
    });
  }

  // Check if book3 exists
  const existingBook3 = await prisma.book.findFirst({
    where: { isbn: "9780134685991" },
  });

  if (!existingBook3) {
    await prisma.book.create({
      data: {
        title: "The Art of Computer Programming",
        author: "Donald E. Knuth",
        isbn: "9780134685991",
        price: 120.00,
        stock: 8,
        category: "REFERENCE",
      },
    });
  }

  // Check if application1 exists
  const existingApplication1 = await prisma.admission.findFirst({
    where: { email: "john.applicant@example.com" },
  });

  if (!existingApplication1) {
    await prisma.admission.create({
      data: {
        firstName: "Charlie",
        lastName: "Brown",
        email: "john.applicant@example.com",
        phone: "+1234567894",
        dateOfBirth: new Date("2002-07-15"),
        course: "Computer Science",
        status: "PENDING",
        message: "Interested in AI and machine learning",
      },
    });
  }

  // Check if application2 exists
  const existingApplication2 = await prisma.admission.findFirst({
    where: { email: "sarah.student@example.com" },
  });

  if (!existingApplication2) {
    await prisma.admission.create({
      data: {
        firstName: "Diana",
        lastName: "Evans",
        email: "sarah.student@example.com",
        phone: "+1234567895",
        dateOfBirth: new Date("2001-11-25"),
        course: "Mathematics",
        status: "APPROVED",
        message: "Passionate about mathematics and research",
      },
    });
  }

  // Get student IDs for display
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
      `Student ${index + 1}: ${student.id} (${student.firstName} ${student.lastName})`
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
