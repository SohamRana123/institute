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

    // Create response with httpOnly cookie only (include token in body for testing)
    const response = NextResponse.json({
      ok: true,
      message: "Login successful",
      data: {
        user: userWithoutPassword,
        // Include token in response body for testing purposes
        token: token
      },
    });

    // Set httpOnly cookie with proper settings
    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure: false, // Set to false for localhost testing
      sameSite: "lax", // Allow cross-site requests for redirects
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/", // Ensure cookie is available for all paths
      // Domain is automatically set to the current domain
    });
    
    // Also set a non-httpOnly cookie for client-side access during testing
    response.cookies.set("auth_token_client", token, {
      httpOnly: false,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });
    
    // Log cookie setting for debugging
    console.log("Setting auth cookie with token length:", token.length);

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
