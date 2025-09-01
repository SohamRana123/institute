import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getTokenFromHeader, verifyToken } from "@/lib/auth";

export async function GET(request) {
  try {
    // Extract token from Authorization header
    const authHeader = request.headers.get("authorization");
    console.log("Auth header:", authHeader ? "Present" : "Missing");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("No valid Authorization header found");
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    console.log("Token extracted from header:", token ? "Present" : "Missing");

    if (!token) {
      console.log("No token found in Authorization header");
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    console.log("Token verification result:", decoded ? "Valid" : "Invalid");

    if (!decoded) {
      console.log("Invalid token provided");
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Only teachers can view all users
    console.log("User role from token:", decoded.role);
    if (decoded.role !== "ADMIN" && decoded.role !== "TEACHER") {
      console.log("User not authorized to view users, role:", decoded.role);
      return NextResponse.json(
        { error: "Not authorized to view users" },
        { status: 403 }
      );
    }
    console.log("User authorized to view users, role:", decoded.role);

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            status: true,
          },
        },
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            department: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Get users error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
