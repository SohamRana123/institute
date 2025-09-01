import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Create response with success message
    const response = NextResponse.json({
      ok: true,
      message: "Logout successful",
    });

    // Clear the authToken cookie
    response.cookies.set("authToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0, // Expire immediately
      path: "/",
    });

    console.log("Logout successful, cookie cleared");
    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { ok: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
