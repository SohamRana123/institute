import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireTeacherAdmin } from "@/lib/auth";

export async function PATCH(request, { params }) {
  try {
    // Check authentication and authorization
    const user = requireTeacherAdmin(request);

    const { id } = params;
    const body = await request.json();
    const { reason } = body;

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

    // Update teacher request status to rejected
    const updatedRequest = await prisma.teacherRequest.update({
      where: { id },
      data: {
        status: "REJECTED",
        message: reason
          ? `${teacherRequest.message || ""}\n\nRejection Reason: ${reason}`
          : teacherRequest.message,
      },
    });

    console.log(
      `Teacher request ${id} rejected successfully by user: ${user.id}`
    );

    return NextResponse.json({
      ok: true,
      message: "Teacher request rejected successfully",
      data: {
        request: {
          id: updatedRequest.id,
          status: updatedRequest.status,
          message: updatedRequest.message,
        },
      },
    });
  } catch (error) {
    console.error("Reject teacher request error:", error);

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
