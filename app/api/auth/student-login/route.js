import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { generateToken } from "@/lib/auth";

// Create a new Prisma client instance for this request
const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const { studentId } = body;

    console.log("Student login attempt with ID:", studentId);

    // Validate required fields
    if (!studentId) {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 }
      );
    }

    // Find student by Student ID
    const student = await prisma.student.findFirst({
      where: {
        id: studentId,
        status: "ACTIVE", // Only active students can login
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });

    console.log("Found student:", student ? "Yes" : "No");

    if (!student) {
      return NextResponse.json(
        { error: "Invalid Student ID or student not found" },
        { status: 401 }
      );
    }

    // Check if the associated user exists and is a student
    if (!student.user || student.user.role !== "STUDENT") {
      return NextResponse.json(
        { error: "Invalid student account" },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateToken(student.user.id, student.user.role);

    // Prepare response data
    const userData = {
      id: student.user.id,
      email: student.user.email,
      role: student.user.role,
      student: {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        phone: student.phone,
        address: student.address,
        dateOfBirth: student.dateOfBirth,
        enrollmentDate: student.enrollmentDate,
        status: student.status,
      },
    };

    console.log(
      "Login successful for student:",
      student.firstName,
      student.lastName
    );

    return NextResponse.json({
      message: "Login successful",
      user: userData,
      token,
    });
  } catch (error) {
    console.error("Student login error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
