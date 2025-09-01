import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireTeacherAdmin } from "@/lib/auth";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate") ? new Date(searchParams.get("startDate")) : null;
    const endDate = searchParams.get("endDate") ? new Date(searchParams.get("endDate")) : null;

    // Build filter object
    const filter = {};
    if (startDate && endDate) {
      filter.OR = [
        {
          startDate: {
            gte: startDate,
            lte: endDate
          }
        },
        {
          endDate: {
            gte: startDate,
            lte: endDate
          }
        },
        {
          AND: [
            { startDate: { lte: startDate } },
            { endDate: { gte: endDate } }
          ]
        }
      ];
    } else if (startDate) {
      filter.startDate = { gte: startDate };
    } else if (endDate) {
      filter.endDate = { lte: endDate };
    }

    // Get calendar events
    const calendarEvents = await prisma.calendar.findMany({
      where: filter,
      orderBy: { startDate: 'asc' }
    });

    return NextResponse.json({ ok: true, data: calendarEvents });
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    return NextResponse.json(
      { ok: false, message: "Failed to fetch calendar events" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // Check authentication and authorization
    const user = requireTeacherAdmin(request);
    
    const body = await request.json();
    const { title, fileUrl, startDate, endDate } = body;

    // Validate required fields
    if (!title || !fileUrl || !startDate || !endDate) {
      return NextResponse.json(
        { ok: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate dates
    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
      return NextResponse.json(
        { ok: false, message: "Invalid date format" },
        { status: 400 }
      );
    }

    if (parsedStartDate > parsedEndDate) {
      return NextResponse.json(
        { ok: false, message: "Start date must be before end date" },
        { status: 400 }
      );
    }

    // Create calendar event
    const calendarEvent = await prisma.calendar.create({
      data: {
        title,
        fileUrl,
        startDate: parsedStartDate,
        endDate: parsedEndDate,
        createdBy: user.id,
      },
    });

    return NextResponse.json({ ok: true, data: calendarEvent }, { status: 201 });
  } catch (error) {
    console.error("Error creating calendar event:", error);
    return NextResponse.json(
      { ok: false, message: "Failed to create calendar event" },
      { status: 500 }
    );
  }
}