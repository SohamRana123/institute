import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword, generateToken } from "@/lib/auth";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      email,
      password,
      role,
      firstName,
      lastName,
      phone,
      department,
      dateOfBirth,
      address,
    } = body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user and related profile
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: role || "STUDENT",
        ...(role === "TEACHER_ADMIN"
          ? {
              teacher: {
                create: {
                  firstName,
                  lastName,
                  phone,
                  department: department || "General",
                  hireDate: new Date(),
                },
              },
            }
          : role === "STUDENT"
          ? {
              student: {
                create: {
                  firstName,
                  lastName,
                  phone,
                  address,
                  dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : new Date(),
                  enrollmentDate: new Date(),
                },
              },
            }
          : {}),
      },
      include: {
        student: true,
        teacher: true,
      },
    });

    // Generate token
    const token = generateToken(user.id, user.role);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      message: "User registered successfully",
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
