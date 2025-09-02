const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Adding minimal data to database...");

  try {
    // Check if admin user exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: "admin@institute.com" },
    });

    if (!existingAdmin) {
      // Create admin user
      const adminPassword = await bcrypt.hash("admin123", 12);
      const adminUser = await prisma.user.create({
        data: {
          email: "admin@institute.com",
          password: adminPassword,
          role: "ADMIN",
          teacher: {
            create: {
              firstName: "Admin",
              lastName: "User",
              phone: "+1234567890",
              department: "Administration",
              hireDate: new Date(),
            },
          },
        },
      });
      console.log("Created admin user:", adminUser.id);
    } else {
      console.log("Admin user already exists");
    }

    // Check if student user exists
    const existingStudent = await prisma.user.findUnique({
      where: { email: "student@institute.com" },
    });

    if (!existingStudent) {
      // Create student user
      const studentPassword = await bcrypt.hash("student123", 12);
      const studentUser = await prisma.user.create({
        data: {
          email: "student@institute.com",
          password: studentPassword,
          role: "STUDENT",
          student: {
            create: {
              firstName: "Student",
              lastName: "User",
              phone: "+1987654321",
              address: "123 Student St, City, State",
              dateOfBirth: new Date("2000-01-01"),
              enrollmentDate: new Date(),
            },
          },
        },
      });
      console.log("Created student user:", studentUser.id);
    } else {
      console.log("Student user already exists");
    }

    // Get teacher for course creation
    const teacher = await prisma.teacher.findFirst();
    if (!teacher) {
      console.log("No teacher found, cannot create course");
      return;
    }

    // Check if course exists
    const existingCourse = await prisma.course.findUnique({
      where: { code: "CS101" },
    });

    if (!existingCourse) {
      // Create course
      const course = await prisma.course.create({
        data: {
          name: "Introduction to Computer Science",
          code: "CS101",
          description: "An introductory course to computer science concepts",
          credits: 3,
          teacherId: teacher.id,
          semester: "Fall",
          year: 2023,
        },
      });
      console.log("Created course:", course.id);
    } else {
      console.log("Course already exists");
    }

    // Get student for enrollment
    const student = await prisma.student.findFirst();
    if (!student) {
      console.log("No student found, cannot create enrollment");
      return;
    }

    // Get course for enrollment
    const course = await prisma.course.findFirst();
    if (!course) {
      console.log("No course found, cannot create enrollment");
      return;
    }

    // Check if enrollment exists
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        studentId: student.id,
        courseId: course.id,
      },
    });

    if (!existingEnrollment) {
      // Create enrollment
      const enrollment = await prisma.enrollment.create({
        data: {
          studentId: student.id,
          courseId: course.id,
          grade: "A",
        },
      });
      console.log("Created enrollment:", enrollment.id);
    } else {
      console.log("Enrollment already exists");
    }

    // Create performance record
    const existingPerformance = await prisma.performance.findFirst({
      where: {
        studentId: student.id,
        courseId: course.id,
      },
    });

    if (!existingPerformance) {
      const performance = await prisma.performance.create({
        data: {
          studentId: student.id,
          courseId: course.id,
          examType: "MIDTERM",
          score: 85,
          maxScore: 100,
          examDate: new Date(),
        },
      });
      console.log("Created performance record:", performance.id);
    } else {
      console.log("Performance record already exists");
    }

    // Create book
    const existingBook = await prisma.book.findFirst({
      where: { isbn: "9781234567890" },
    });

    if (!existingBook) {
      const book = await prisma.book.create({
        data: {
          title: "Introduction to Programming",
          author: "John Smith",
          isbn: "9781234567890",
          price: 49.99,
          stock: 100,
          description: "A comprehensive guide to programming fundamentals",
        },
      });
      console.log("Created book:", book.id);
    } else {
      console.log("Book already exists");
    }

    // Create order and order item
    const existingOrder = await prisma.order.findFirst({
      where: { studentId: student.id },
    });

    if (!existingOrder) {
      const book = await prisma.book.findFirst();
      if (!book) {
        console.log("No book found, cannot create order");
        return;
      }

      const order = await prisma.order.create({
        data: {
          student: {
            connect: { id: student.id }
          },
          total: book.price,
          status: "CONFIRMED",
          customerName: `${student.firstName} ${student.lastName}`,
          customerEmail: "student@institute.com",
          items: {
            create: {
              bookId: book.id,
              quantity: 1,
              price: book.price,
            },
          },
        },
      });
      console.log("Created order:", order.id);
    } else {
      console.log("Order already exists");
    }

    // Create admission record
    const existingAdmission = await prisma.admission.findFirst({
      where: { email: "newstudent@example.com" },
    });

    if (!existingAdmission) {
      const admission = await prisma.admission.create({
        data: {
          firstName: "New",
          lastName: "Student",
          email: "newstudent@example.com",
          phone: "+1122334455",
          status: "PENDING",
          dateOfBirth: new Date("2000-01-01"),
          course: "Computer Science",
        },
      });
      console.log("Created admission record:", admission.id);
    } else {
      console.log("Admission record already exists");
    }

    // Create teacher request
    const existingTeacherRequest = await prisma.teacherRequest.findFirst({
      where: { email: "newteacher@example.com" },
    });

    if (!existingTeacherRequest) {
      const teacherRequest = await prisma.teacherRequest.create({
        data: {
          firstName: "New",
          lastName: "Teacher",
          email: "newteacher@example.com",
          phone: "+1567890123",
          department: "Physics",
          status: "PENDING",
          qualification: "PhD",
          experience: "5 years",
        },
      });
      console.log("Created teacher request:", teacherRequest.id);
    } else {
      console.log("Teacher request already exists");
    }

    // Create curriculum
    const existingCurriculum = await prisma.curriculum.findFirst({
      where: { courseId: course.id },
    });

    if (!existingCurriculum) {
      const curriculum = await prisma.curriculum.create({
        data: {
          courseId: course.id,
          title: "CS101 Curriculum",
          fileUrl: "/files/cs101-curriculum.pdf",
          year: 2023,
          semester: "Fall",
          createdBy: "admin",
        },
      });
      console.log("Created curriculum:", curriculum.id);
    } else {
      console.log("Curriculum already exists");
    }

    console.log("Minimal data added successfully!");
  } catch (error) {
    console.error("Error adding minimal data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });