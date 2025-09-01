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

    // Update admission status to rejected
    const updatedAdmission = await prisma.admission.update({
      where: { id },
      data: {
        status: "REJECTED",
        message: reason
          ? `${admission.message || ""}\n\nRejection Reason: ${reason}`
          : admission.message,
      },
    });

    console.log(`Admission ${id} rejected successfully by user: ${user.id}`);

    return NextResponse.json({
      ok: true,
      message: "Admission rejected successfully",
      data: {
        admission: {
          id: updatedAdmission.id,
          status: updatedAdmission.status,
          message: updatedAdmission.message,
        },
      },
    });
  } catch (error) {
    console.error("Reject admission error:", error);

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
