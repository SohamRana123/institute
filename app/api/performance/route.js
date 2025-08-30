import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getTokenFromHeader, verifyToken } from "@/lib/auth";

export async function GET(request) {
  try {
    const token = getTokenFromHeader(request);
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Get student ID
    const student = await prisma.student.findUnique({
      where: { userId: decoded.userId },
    });

    if (!student) {
      return NextResponse.json(
        { error: "Student profile not found" },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");
    const examType = searchParams.get("examType");

    const where = {
      studentId: student.id,
    };

    if (courseId) {
      where.courseId = courseId;
    }

    if (examType) {
      where.examType = examType;
    }

    const performances = await prisma.performance.findMany({
      where,
      orderBy: { examDate: "desc" },
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
    });

    // Calculate statistics
    const totalExams = performances.length;
    const averageScore =
      totalExams > 0
        ? performances.reduce(
            (sum, p) => sum + (p.score / p.maxScore) * 100,
            0
          ) / totalExams
        : 0;

    const examTypeStats = {};
    performances.forEach((p) => {
      if (!examTypeStats[p.examType]) {
        examTypeStats[p.examType] = { count: 0, totalScore: 0 };
      }
      examTypeStats[p.examType].count++;
      examTypeStats[p.examType].totalScore += (p.score / p.maxScore) * 100;
    });

    Object.keys(examTypeStats).forEach((type) => {
      examTypeStats[type].average =
        examTypeStats[type].totalScore / examTypeStats[type].count;
    });

    return NextResponse.json({
      performances,
      statistics: {
        totalExams,
        averageScore: Math.round(averageScore * 100) / 100,
        examTypeStats,
      },
    });
  } catch (error) {
    console.error("Get performance error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const token = getTokenFromHeader(request);
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Only teachers can add performance records
    if (decoded.role !== "TEACHER") {
      return NextResponse.json(
        { error: "Only teachers can add performance records" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      studentId,
      courseId,
      examType,
      score,
      maxScore,
      examDate,
      remarks,
    } = body;

    // Validate required fields
    if (!studentId || !courseId || !examType || !score || !maxScore) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate score
    if (score > maxScore) {
      return NextResponse.json(
        { error: "Score cannot be greater than max score" },
        { status: 400 }
      );
    }

    // Create performance record
    const performance = await prisma.performance.create({
      data: {
        studentId,
        courseId,
        examType,
        score: parseFloat(score),
        maxScore: parseFloat(maxScore),
        examDate: examDate ? new Date(examDate) : new Date(),
        remarks,
      },
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
    });

    return NextResponse.json({
      message: "Performance record created successfully",
      performance,
    });
  } catch (error) {
    console.error("Create performance error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
