import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { generateSecurePassword } from "@/lib/generateRollNo";
import { requireTeacherAdmin } from "@/lib/auth";

export async function PATCH(request, { params }) {
  try {
    // Check authentication and authorization
    const user = requireTeacherAdmin(request);

    const { id } = params;

    // Get teacher request details
    const teacherRequest = await prisma.teacherRequest.findUnique({
      where: { id },
    });

    if (!teacherRequest) {
      return NextResponse.json(
        { ok: false, message: "Teacher request not found" },
        { status: 404 }
      );
    }

    if (teacherRequest.status !== "PENDING") {
      return NextResponse.json(
        { ok: false, message: "Teacher request is not pending approval" },
        { status: 400 }
      );
    }

    // Check if user already exists with this email
    const existingUser = await prisma.user.findUnique({
      where: { email: teacherRequest.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { ok: false, message: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Generate secure password
    const password = generateSecurePassword();
    const hashedPassword = await hashPassword(password);

    // Use Prisma transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const newUser = await tx.user.create({
        data: {
          email: teacherRequest.email,
          password: hashedPassword,
          role: "TEACHER",
        },
      });

      // Create teacher profile
      const newTeacher = await tx.teacher.create({
        data: {
          userId: newUser.id,
          firstName: teacherRequest.firstName,
          lastName: teacherRequest.lastName,
          phone: teacherRequest.phone,
          department: teacherRequest.department,
          hireDate: new Date(),
          status: "ACTIVE",
        },
      });

      // Update teacher request status
      const updatedRequest = await tx.teacherRequest.update({
        where: { id },
        data: { status: "APPROVED" },
      });

      return {
        user: newUser,
        teacher: newTeacher,
        request: updatedRequest,
        plainPassword: password, // Return plain password for admin to share
      };
    });

    console.log(
      `Teacher request ${id} approved successfully. Created user: ${result.user.id}, teacher: ${result.teacher.id}`
    );

    return NextResponse.json({
      ok: true,
      message: "Teacher request approved successfully",
      data: {
        user: {
          id: result.user.id,
          email: result.user.email,
          role: result.user.role,
        },
        teacher: {
          id: result.teacher.id,
          firstName: result.teacher.firstName,
          lastName: result.teacher.lastName,
          department: result.teacher.department,
        },
        request: {
          id: result.request.id,
          status: result.request.status,
        },
        credentials: {
          email: result.user.email,
          password: result.plainPassword,
        },
      },
    });
  } catch (error) {
    console.error("Approve teacher request error:", error);

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
