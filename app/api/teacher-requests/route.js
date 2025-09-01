import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      department,
      qualification,
      experience,
      message,
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !department) {
      return NextResponse.json(
        { ok: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists with this email
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { ok: false, message: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Check if teacher request already exists with this email
    const existingRequest = await prisma.teacherRequest.findUnique({
      where: { email },
    });

    if (existingRequest) {
      return NextResponse.json(
        {
          ok: false,
          message: "Teacher request already submitted with this email",
        },
        { status: 400 }
      );
    }

    // Create teacher request
    const teacherRequest = await prisma.teacherRequest.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        department,
        qualification,
        experience,
        message,
        status: "PENDING",
      },
    });

    console.log(`Teacher request submitted: ${email} for ${department}`);

    return NextResponse.json({
      ok: true,
      message:
        "Teacher request submitted successfully. Please wait for admin approval.",
      data: { teacherRequest },
    });
  } catch (error) {
    console.error("Teacher request error:", error);
    return NextResponse.json(
      { ok: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const where = {};
    if (status) {
      where.status = status;
    }

    const [teacherRequests, total] = await Promise.all([
      prisma.teacherRequest.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.teacherRequest.count({ where }),
    ]);

    return NextResponse.json({
      ok: true,
      message: "Teacher requests retrieved successfully",
      data: {
        teacherRequests,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Get teacher requests error:", error);
    return NextResponse.json(
      { ok: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
