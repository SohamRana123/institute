import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireTeacherAdmin } from "@/lib/auth";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get("teacherId");
    const status = searchParams.get("status");
    const semester = searchParams.get("semester");
    const year = searchParams.get("year");

    const where = {};

    if (teacherId) {
      where.teacherId = teacherId;
    }

    if (status) {
      where.status = status;
    }

    if (semester) {
      where.semester = semester;
    }

    if (year) {
      where.year = parseInt(year);
    }

    const courses = await prisma.course.findMany({
      where,
      include: {
        teacher: {
          include: {
            user: {
              select: {
                email: true,
              },
            },
          },
        },
        enrollments: {
          include: {
            student: {
              include: {
                user: {
                  select: {
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      ok: true,
      message: "Courses retrieved successfully",
      data: { courses },
    });
  } catch (error) {
    console.error("Get courses error:", error);
    return NextResponse.json(
      { ok: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // Check authentication and authorization
    const user = requireTeacherAdmin(request);
    
    // Only teachers can create courses
    if (user.role !== "TEACHER" && user.role !== "ADMIN") {
      return NextResponse.json(
        { ok: false, message: "Only teachers and admins can create courses" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, code, description, credits, semester, year } = body;

    // Validate required fields
    if (!name || !code || !credits || !semester || !year) {
      return NextResponse.json(
        { ok: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get teacher ID
    const teacher = await prisma.teacher.findUnique({
      where: { userId: user.id },
    });

    if (!teacher) {
      return NextResponse.json(
        { ok: false, message: "Teacher profile not found" },
        { status: 404 }
      );
    }

    // Check if course code already exists
    const existingCourse = await prisma.course.findUnique({
      where: { code },
    });

    if (existingCourse) {
      return NextResponse.json(
        { ok: false, message: "Course with this code already exists" },
        { status: 400 }
      );
    }

    // Create course
    const course = await prisma.course.create({
      data: {
        name,
        code,
        description,
        credits: parseInt(credits),
        teacherId: teacher.id,
        semester,
        year: parseInt(year),
        status: "ACTIVE",
      },
      include: {
        teacher: {
          include: {
            user: {
              select: {
                email: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      ok: true,
      message: "Course created successfully",
      data: { course },
    });
  } catch (error) {
    console.error("Create course error:", error);
    return NextResponse.json(
      { ok: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
