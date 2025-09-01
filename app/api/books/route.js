import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { logAction, AUDIT_ACTIONS } from "@/lib/audit";
import { createErrorResponse, createSuccessResponse, ERROR_CODES, validateWithZod, schemas } from "@/lib/validation";
import { requireTeacherAdmin } from "@/lib/auth";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 12;
    const skip = (page - 1) * limit;

    const where = {
      status: "ACTIVE",
    };

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { author: { contains: search, mode: "insensitive" } },
        { isbn: { contains: search, mode: "insensitive" } },
      ];
    }

    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.book.count({ where }),
    ]);

    const { response, status } = createSuccessResponse(
      "Books retrieved successfully",
      {
        books,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      }
    );
    return NextResponse.json(response, { status });
  } catch (error) {
    console.error("Get books error:", error);
    console.error("Error details:", error);
    const { response, status } = createErrorResponse(
      ERROR_CODES.INTERNAL_ERROR,
      "Failed to fetch books",
      { message: error.message }
    );
    return NextResponse.json(response, { status });
  }
}

export async function POST(request) {
  try {
    // Check authentication and authorization
    const user = requireTeacherAdmin(request);
    const body = await request.json();
    
    // Validate with Zod schema
    const validation = validateWithZod(schemas.book.create, body);
    if (!validation.success) {
      return NextResponse.json(validation.error.response, { status: validation.error.status });
    }
    
    const {
      title,
      author,
      isbn,
      publisher,
      price,
      stock,
      description,
      category,
      imageUrl,
    } = validation.data;

    // Check if book with ISBN already exists
    const existingBook = await prisma.book.findUnique({
      where: { isbn },
    });

    if (existingBook) {
      const { response, status } = createErrorResponse(
        ERROR_CODES.CONFLICT,
        "Book with this ISBN already exists",
        { isbn }
      );
      return NextResponse.json(response, { status });
    }

    // Create book
    const book = await prisma.book.create({
      data: {
        title,
        author,
        isbn,
        publisher,
        price: parseFloat(price),
        stock: parseInt(stock) || 0,
        description,
        category,
        imageUrl,
        status: "ACTIVE",
      },
    });
    
    // Log the action to audit log
    await logAction(
      user.id,
      AUDIT_ACTIONS.BOOK.CREATE,
      'book',
      book.id,
      {
        title,
        author,
        isbn,
        price: parseFloat(price),
        stock: parseInt(stock) || 0,
        category
      }
    );

    const { response, status } = createSuccessResponse(
      "Book created successfully",
      book,
      201
    );
    return NextResponse.json(response, { status });
  } catch (error) {
    console.error("Create book error:", error);
    console.error("Error details:", error);
    const { response, status } = createErrorResponse(
      ERROR_CODES.INTERNAL_ERROR,
      "Failed to create book",
      { message: error.message }
    );
    return NextResponse.json(response, { status });
  }
}
