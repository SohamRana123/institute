import { z } from "zod";

/**
 * Error codes for consistent API error responses
 */
export const ERROR_CODES = {
  VALIDATION: "VALIDATION_ERROR",
  NOT_FOUND: "NOT_FOUND",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  CONFLICT: "CONFLICT",
  INTERNAL: "INTERNAL_SERVER_ERROR",
};

/**
 * Create a standardized error response
 * @param {string} code - Error code from ERROR_CODES
 * @param {string} message - Human-readable error message
 * @param {Object} [details] - Additional error details
 * @returns {Object} - Error response object with status code
 */
export function createErrorResponse(code, message, details = null) {
  let status = 500;
  
  switch (code) {
    case ERROR_CODES.VALIDATION:
      status = 400;
      break;
    case ERROR_CODES.NOT_FOUND:
      status = 404;
      break;
    case ERROR_CODES.UNAUTHORIZED:
      status = 401;
      break;
    case ERROR_CODES.FORBIDDEN:
      status = 403;
      break;
    case ERROR_CODES.CONFLICT:
      status = 409;
      break;
    default:
      status = 500;
  }
  
  return {
    response: {
      ok: false,
      error: {
        code,
        message,
        ...(details && { details }),
      },
    },
    status,
  };
}

/**
 * Create a standardized success response
 * @param {string} message - Success message
 * @param {Object} [data] - Response data
 * @returns {Object} - Success response object with status code
 */
export function createSuccessResponse(message, data = null) {
  return {
    response: {
      ok: true,
      message,
      ...(data && { data }),
    },
    status: 200,
  };
}

/**
 * Validate data with a Zod schema
 * @param {z.ZodSchema} schema - Zod schema to validate against
 * @param {Object} data - Data to validate
 * @returns {Object} - Validation result
 */
export function validateWithZod(schema, data) {
  try {
    const validatedData = schema.parse(data);
    return {
      success: true,
      data: validatedData,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map((err) => ({
        path: err.path.join("."),
        message: err.message,
      }));
      
      return {
        success: false,
        error: createErrorResponse(
          ERROR_CODES.VALIDATION,
          "Validation failed",
          { errors: formattedErrors }
        ),
      };
    }
    
    return {
      success: false,
      error: createErrorResponse(
        ERROR_CODES.INTERNAL,
        "An unexpected error occurred during validation"
      ),
    };
  }
}

/**
 * Validation schemas for different entities
 */
export const schemas = {
  book: {
    create: z.object({
      title: z.string().min(1, "Title is required"),
      author: z.string().min(1, "Author is required"),
      isbn: z.string().min(10, "ISBN must be at least 10 characters"),
      publisher: z.string().optional(),
      price: z.number().positive("Price must be positive").or(z.string().regex(/^\d+(\.\d+)?$/, "Price must be a valid number")),
      stock: z.number().int().nonnegative("Stock must be non-negative").or(z.string().regex(/^\d+$/, "Stock must be a valid integer")),
      description: z.string().optional(),
      category: z.string().optional(),
      imageUrl: z.string().url("Image URL must be a valid URL").optional().nullable(),
    }),
    update: z.object({
      title: z.string().min(1, "Title is required").optional(),
      author: z.string().min(1, "Author is required").optional(),
      isbn: z.string().min(10, "ISBN must be at least 10 characters").optional(),
      publisher: z.string().optional(),
      price: z.number().positive("Price must be positive").or(z.string().regex(/^\d+(\.\d+)?$/, "Price must be a valid number")).optional(),
      stock: z.number().int().nonnegative("Stock must be non-negative").or(z.string().regex(/^\d+$/, "Stock must be a valid integer")).optional(),
      description: z.string().optional(),
      category: z.string().optional(),
      imageUrl: z.string().url("Image URL must be a valid URL").optional().nullable(),
      status: z.enum(["ACTIVE", "INACTIVE", "OUT_OF_STOCK"]).optional(),
    }),
  },
  order: {
    create: z.object({
      items: z.array(
        z.object({
          bookId: z.string().uuid("Book ID must be a valid UUID"),
          quantity: z.number().int().positive("Quantity must be positive").or(z.string().regex(/^\d+$/, "Quantity must be a valid integer")),
        })
      ).min(1, "At least one item is required"),
    }),
    update: z.object({
      status: z.enum(["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"]),
    }),
  },
  admission: {
    create: z.object({
      firstName: z.string().min(1, "First name is required"),
      lastName: z.string().min(1, "Last name is required"),
      email: z.string().email("Invalid email address"),
      phone: z.string().min(10, "Phone number must be at least 10 characters"),
      dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Date of birth must be a valid date",
      }),
      course: z.string().min(1, "Course is required"),
      message: z.string().optional(),
    }),
  },
  teacher: {
    request: z.object({
      firstName: z.string().min(1, "First name is required"),
      lastName: z.string().min(1, "Last name is required"),
      email: z.string().email("Invalid email address"),
      phone: z.string().min(10, "Phone number must be at least 10 characters").optional(),
      department: z.string().min(1, "Department is required"),
      qualification: z.string().optional(),
      experience: z.string().optional(),
      message: z.string().optional(),
    }),
  },
  course: {
    create: z.object({
      name: z.string().min(1, "Name is required"),
      code: z.string().min(2, "Code must be at least 2 characters"),
      description: z.string().optional(),
      credits: z.number().int().positive("Credits must be positive").or(z.string().regex(/^\d+$/, "Credits must be a valid integer")),
      semester: z.string().min(1, "Semester is required"),
      year: z.number().int().positive("Year must be positive").or(z.string().regex(/^\d+$/, "Year must be a valid integer")),
    }),
    update: z.object({
      name: z.string().min(1, "Name is required").optional(),
      code: z.string().min(2, "Code must be at least 2 characters").optional(),
      description: z.string().optional(),
      credits: z.number().int().positive("Credits must be positive").or(z.string().regex(/^\d+$/, "Credits must be a valid integer")).optional(),
      semester: z.string().min(1, "Semester is required").optional(),
      year: z.number().int().positive("Year must be positive").or(z.string().regex(/^\d+$/, "Year must be a valid integer")).optional(),
      status: z.enum(["ACTIVE", "INACTIVE", "COMPLETED"]).optional(),
    }),
  },
  curriculum: {
    create: z.object({
      courseId: z.string().uuid("Course ID must be a valid UUID").optional(),
      title: z.string().min(1, "Title is required"),
      fileUrl: z.string().url("File URL must be a valid URL"),
      year: z.number().int().positive("Year must be positive").or(z.string().regex(/^\d+$/, "Year must be a valid integer")),
      semester: z.string().min(1, "Semester is required"),
    }),
  },
  performance: {
    create: z.object({
      studentId: z.string().uuid("Student ID must be a valid UUID"),
      courseId: z.string().uuid("Course ID must be a valid UUID"),
      examType: z.enum(["MIDTERM", "FINAL", "QUIZ", "ASSIGNMENT", "PROJECT"]),
      score: z.number().nonnegative("Score must be non-negative").or(z.string().regex(/^\d+(\.\d+)?$/, "Score must be a valid number")),
      maxScore: z.number().positive("Max score must be positive").or(z.string().regex(/^\d+(\.\d+)?$/, "Max score must be a valid number")),
      examDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Exam date must be a valid date",
      }),
      remarks: z.string().optional(),
    }),
    bulkCreate: z.array(
      z.object({
        studentId: z.string().uuid("Student ID must be a valid UUID"),
        courseId: z.string().uuid("Course ID must be a valid UUID"),
        examType: z.enum(["MIDTERM", "FINAL", "QUIZ", "ASSIGNMENT", "PROJECT"]),
        score: z.number().nonnegative("Score must be non-negative").or(z.string().regex(/^\d+(\.\d+)?$/, "Score must be a valid number")),
        maxScore: z.number().positive("Max score must be positive").or(z.string().regex(/^\d+(\.\d+)?$/, "Max score must be a valid number")),
        examDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
          message: "Exam date must be a valid date",
        }),
        remarks: z.string().optional(),
      })
    ).min(1, "At least one performance record is required"),
  },
  calendar: {
    create: z.object({
      title: z.string().min(1, "Title is required"),
      fileUrl: z.string().url("File URL must be a valid URL"),
      startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Start date must be a valid date",
      }),
      endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "End date must be a valid date",
      }),
    }),
  },
};