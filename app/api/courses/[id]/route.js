import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireTeacherAdmin } from "@/lib/auth";

export async function PATCH(request, { params }) {
  try {
    // Check authentication and authorization
    const user = requireTeacherAdmin(request);
    
    const { id } = params;
    const body = await request.json();
    const { name, code, description, credits, semester, year, status } = body;

    // Get course details
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        teacher: {
          include: {
            user: {
              select: { id: true },
            },
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json(
        { ok: false, message: "Course not found" },
        { status: 404 }
      );
    }

    // Check if user is the course teacher or admin
    if (user.role !== "ADMIN" && course.teacher.user.id !== user.id) {
      return NextResponse.json(
        { ok: false, message: "You can only edit your own courses" },
        { status: 403 }
      );
    }

    // If code is being changed, check for uniqueness
    if (code && code !== course.code) {
      const existingCourse = await prisma.course.findUnique({
        where: { code },
      });

      if (existingCourse) {
        return NextResponse.json(
          { ok: false, message: "Course with this code already exists" },
          { status: 400 }
        );
      }
    }

    // Update course
    const updatedCourse = await prisma.course.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(code && { code }),
        ...(description !== undefined && { description }),
        ...(credits && { credits: parseInt(credits) }),
        ...(semester && { semester }),
        ...(year && { year: parseInt(year) }),
        ...(status && { status }),
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
      message: "Course updated successfully",
      data: { course: updatedCourse },
    });

  } catch (error) {
    console.error("Update course error:", error);
    
    if (error.message.includes("Authentication required") || error.message.includes("Teacher or Admin access required")) {
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

export async function DELETE(request, { params }) {
  try {
    // Check authentication and authorization
    const user = requireTeacherAdmin(request);
    
    const { id } = params;

    // Get course details
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        teacher: {
          include: {
            user: {
              select: { id: true },
            },
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json(
        { ok: false, message: "Course not found" },
        { status: 404 }
      );
    }

    // Check if user is the course teacher or admin
    if (user.role !== "ADMIN" && course.teacher.user.id !== user.id) {
      return NextResponse.json(
        { ok: false, message: "You can only delete your own courses" },
        { status: 403 }
      );
    }

    // Check if course has enrollments
    const enrollments = await prisma.enrollment.findMany({
      where: { courseId: id },
    });

    if (enrollments.length > 0) {
      return NextResponse.json(
        { ok: false, message: "Cannot delete course with active enrollments" },
        { status: 400 }
      );
    }

    // Delete course
    await prisma.course.delete({
      where: { id },
    });

    return NextResponse.json({
      ok: true,
      message: "Course deleted successfully",
    });

  } catch (error) {
    console.error("Delete course error:", error);
    
    if (error.message.includes("Authentication required") || error.message.includes("Teacher or Admin access required")) {
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
