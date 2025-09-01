import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { generateRollNo, generateSecurePassword } from "@/lib/generateRollNo";
import { requireTeacherAdmin } from "@/lib/auth";

export async function PATCH(request, { params }) {
  try {
    // Check authentication and authorization
    const user = requireTeacherAdmin(request);

    const { id } = params;

    // Get admission details
    const admission = await prisma.admission.findUnique({
      where: { id },
    });

    if (!admission) {
      return NextResponse.json(
        { ok: false, message: "Admission not found" },
        { status: 404 }
      );
    }

    if (admission.status !== "PENDING") {
      return NextResponse.json(
        { ok: false, message: "Admission is not pending approval" },
        { status: 400 }
      );
    }

    // Check if user already exists with this email
    const existingUser = await prisma.user.findUnique({
      where: { email: admission.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { ok: false, message: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Generate course code from course name
    const courseCodeMap = {
      "Computer Science": "CS",
      Mathematics: "MATH",
      Physics: "PHY",
      Chemistry: "CHEM",
      Biology: "BIO",
      Engineering: "ENG",
      Business: "BUS",
      Arts: "ARTS",
      Law: "LAW",
    };

    const courseCode = courseCodeMap[admission.course] || "GEN";
    const currentYear = new Date().getFullYear();

    // Generate unique roll number
    const rollNo = await generateRollNo(courseCode, currentYear);

    // Generate secure password
    const password = generateSecurePassword();
    const hashedPassword = await hashPassword(password);

    // Use Prisma transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const newUser = await tx.user.create({
        data: {
          email: admission.email,
          password: hashedPassword,
          role: "STUDENT",
        },
      });

      // Create student profile
      const newStudent = await tx.student.create({
        data: {
          userId: newUser.id,
          firstName: admission.firstName,
          lastName: admission.lastName,
          dateOfBirth: admission.dateOfBirth,
          phone: admission.phone,
          address: admission.message || "",
          rollNo: rollNo,
          enrollmentDate: new Date(),
          status: "ACTIVE",
        },
      });

      // Update admission status
      const updatedAdmission = await tx.admission.update({
        where: { id },
        data: { status: "APPROVED" },
      });

      return {
        user: newUser,
        student: newStudent,
        admission: updatedAdmission,
        plainPassword: password, // Return plain password for admin to share
      };
    });

    console.log(
      `Admission ${id} approved successfully. Created user: ${result.user.id}, student: ${result.student.id}`
    );

    return NextResponse.json({
      ok: true,
      message: "Admission approved successfully",
      data: {
        user: {
          id: result.user.id,
          email: result.user.email,
          role: result.user.role,
        },
        student: {
          id: result.student.id,
          rollNo: result.student.rollNo,
          firstName: result.student.firstName,
          lastName: result.student.lastName,
        },
        admission: {
          id: result.admission.id,
          status: result.admission.status,
        },
        credentials: {
          email: result.user.email,
          password: result.plainPassword,
          rollNo: result.student.rollNo,
        },
      },
    });
  } catch (error) {
    console.error("Approve admission error:", error);

    if (
      error.message.includes("Authentication required") ||
      error.message.includes("Teacher or Admin access required")
    ) {
      return NextResponse.json(
        { ok: false, message: "Unauthorized access" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { ok: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
