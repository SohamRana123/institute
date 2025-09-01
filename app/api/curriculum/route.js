import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireTeacherAdmin } from "@/lib/auth";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");
    const year = searchParams.get("year") ? parseInt(searchParams.get("year")) : null;
    const semester = searchParams.get("semester");

    // Build filter object
    const filter = {};
    if (courseId) filter.courseId = courseId;
    if (year) filter.year = year;
    if (semester) filter.semester = semester;

    // Get curriculum items
    const curriculumItems = await prisma.curriculum.findMany({
      where: filter,
      orderBy: [
        { year: 'desc' },
        { semester: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    // Group by course/year/semester for better organization
    const groupedItems = curriculumItems.reduce((acc, item) => {
      const yearKey = item.year.toString();
      const semesterKey = item.semester;
      
      if (!acc[yearKey]) {
        acc[yearKey] = {};
      }
      
      if (!acc[yearKey][semesterKey]) {
        acc[yearKey][semesterKey] = [];
      }
      
      acc[yearKey][semesterKey].push(item);
      return acc;
    }, {});

    return NextResponse.json({ ok: true, data: { items: curriculumItems, grouped: groupedItems } });
  } catch (error) {
    console.error("Error fetching curriculum:", error);
    return NextResponse.json(
      { ok: false, message: "Failed to fetch curriculum" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // Check authentication and authorization
    const user = requireTeacherAdmin(request);
    
    const body = await request.json();
    const { title, courseId, fileUrl, year, semester } = body;

    // Validate required fields
    if (!title || !fileUrl || !year || !semester) {
      return NextResponse.json(
        { ok: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create curriculum item
    const curriculumItem = await prisma.curriculum.create({
      data: {
        title,
        courseId,
        fileUrl,
        year,
        semester,
        createdBy: user.id,
      },
    });

    return NextResponse.json({ ok: true, data: curriculumItem }, { status: 201 });
  } catch (error) {
    console.error("Error creating curriculum item:", error);
    return NextResponse.json(
      { ok: false, message: "Failed to create curriculum item" },
      { status: 500 }
    );
  }
}