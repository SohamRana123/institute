import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { comparePassword, signJwt } from "@/lib/auth";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log(`Login attempt for email: ${email}`);

    // Validate required fields
    if (!email || !password) {
      console.log("Missing email or password");
      return NextResponse.json(
        { ok: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        student: true,
        teacher: true,
      },
    });

    console.log(`User found: ${!!user}`);

    if (!user) {
      return NextResponse.json(
        { ok: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verify password
    console.log(
      `Attempting to compare password with hash: ${user.password.substring(
        0,
        10
      )}...`
    );
    try {
      const isValidPassword = await comparePassword(password, user.password);
      console.log(`Password valid: ${isValidPassword}`);

      if (!isValidPassword) {
        console.log(`Password validation failed for user: ${email}`);
        return NextResponse.json(
          { ok: false, message: "Invalid credentials" },
          { status: 401 }
        );
      }
    } catch (error) {
      console.error(`Password comparison error: ${error.message}`);
      return NextResponse.json(
        { ok: false, message: "Authentication error" },
        { status: 500 }
      );
    }

    // Generate JWT token
    const token = signJwt(user.id, user.role);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    // Create response with httpOnly cookie only (no token in body)
    const response = NextResponse.json({
      ok: true,
      message: "Login successful",
      data: {
        user: userWithoutPassword,
        // Token is now only sent as httpOnly cookie, not in response body
      },
    });

    // Set httpOnly cookie
    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    console.log("Login successful, cookie set for user:", email);
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { ok: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
