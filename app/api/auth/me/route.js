import { NextResponse } from "next/server";
import { verifyJwt } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request) {
  try {
    // Try to get token from cookie first
    let token = request.cookies.get("authToken")?.value;

    // If no token in authToken cookie, check token cookie
    if (!token) {
      token = request.cookies.get("token")?.value;
    }
    
    // Also check for auth_token_client cookie
    if (!token) {
      token = request.cookies.get("auth_token_client")?.value;
      if (token) {
        console.log('Using token from auth_token_client cookie');
      }
    }

    // If no token in cookies, check Authorization header
    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
        console.log('Using token from Authorization header');
      }
    }

    if (!token) {
      return NextResponse.json(
        { ok: false, message: "No authentication token found" },
        { status: 401 }
      );
    }

    // Verify JWT token
    const decoded = verifyJwt(token);

    if (!decoded) {
      return NextResponse.json(
        { ok: false, message: "Invalid authentication token" },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        student: true,
        teacher: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { ok: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      ok: true,
      message: "User authenticated successfully",
      data: {
        user: userWithoutPassword,
      },
    });
  } catch (error) {
    console.error("Get current user error:", error);
    return NextResponse.json(
      { ok: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
