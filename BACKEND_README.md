# V.K. Institute - Backend API Documentation

## Overview

This is the backend API for the V.K. Institute management system. It provides comprehensive functionality for managing students, teachers, courses, admissions, bookstore operations, and student performance tracking.

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Database**: SQLite (with Prisma ORM)
- **Authentication**: JWT tokens with bcrypt password hashing
- **API**: RESTful API endpoints

## Database Schema

The application uses the following main entities:

### Users & Authentication

- **User**: Base user entity with email, password, and role
- **Student**: Student profile with personal information
- **Teacher**: Teacher profile with department and hire information

### Academic Management

- **Course**: Course information with teacher assignment
- **Enrollment**: Student-course enrollment records
- **Performance**: Student performance tracking with exam scores

### Business Operations

- **Book**: Bookstore inventory management
- **Order**: Student book orders
- **OrderItem**: Individual items in orders
- **Admission**: Admission application management

## API Endpoints

### Authentication

#### POST `/api/auth/register`

Register a new user (student or teacher)

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "STUDENT", // or "TEACHER"
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "department": "Computer Science", // for teachers
  "dateOfBirth": "2000-01-01", // for students
  "address": "123 Main St" // for students
}
```

#### POST `/api/auth/login`

Login with email and password

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "message": "Login successful",
  "user": {
    /* user data */
  },
  "token": "jwt_token_here"
}
```

### Admissions

#### POST `/api/admissions`

Submit a new admission application

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "dateOfBirth": "2000-01-01",
  "course": "Computer Science",
  "message": "I'm interested in this program"
}
```

#### GET `/api/admissions`

Get admission applications (with optional filtering)

**Query Parameters:**

- `status`: Filter by status (PENDING, APPROVED, REJECTED, WAITLISTED)
- `page`: Page number for pagination
- `limit`: Items per page

### Courses

#### GET `/api/courses`

Get all courses (with optional filtering)

**Query Parameters:**

- `teacherId`: Filter by teacher
- `status`: Filter by status (ACTIVE, INACTIVE, COMPLETED)
- `semester`: Filter by semester
- `year`: Filter by year

#### POST `/api/courses`

Create a new course (Teacher only)

**Request Body:**

```json
{
  "name": "Introduction to Computer Science",
  "code": "CS101",
  "description": "Fundamental concepts of computer science",
  "credits": 3,
  "semester": "Fall",
  "year": 2024
}
```

### Enrollments

#### POST `/api/enrollments`

Enroll a student in a course (Student only)

**Request Body:**

```json
{
  "courseId": "course_id_here"
}
```

#### GET `/api/enrollments`

Get enrollment records

**Query Parameters:**

- `studentId`: Filter by student (for teachers)
- `courseId`: Filter by course
- `status`: Filter by status (ENROLLED, DROPPED, COMPLETED)

### Student Performance

#### GET `/api/performance`

Get student performance records (with statistics)

**Query Parameters:**

- `courseId`: Filter by course
- `examType`: Filter by exam type (MIDTERM, FINAL, QUIZ, ASSIGNMENT, PROJECT)

**Response includes:**

- Performance records
- Statistics (total exams, average score, exam type breakdown)

#### POST `/api/performance`

Add a performance record (Teacher only)

**Request Body:**

```json
{
  "studentId": "student_id_here",
  "courseId": "course_id_here",
  "examType": "MIDTERM",
  "score": 85,
  "maxScore": 100,
  "examDate": "2024-10-15",
  "remarks": "Good understanding of concepts"
}
```

### Bookstore

#### GET `/api/books`

Get all books (with optional filtering)

**Query Parameters:**

- `category`: Filter by category
- `search`: Search in title, author, or ISBN
- `page`: Page number for pagination
- `limit`: Items per page

#### POST `/api/books`

Add a new book to inventory

**Request Body:**

```json
{
  "title": "Introduction to Algorithms",
  "author": "Thomas H. Cormen",
  "isbn": "9780262033848",
  "publisher": "MIT Press",
  "price": 89.99,
  "stock": 15,
  "description": "A comprehensive guide to algorithms",
  "category": "Computer Science",
  "imageUrl": "https://example.com/book-cover.jpg"
}
```

### Orders

#### POST `/api/orders`

Create a new book order (Student only)

**Request Body:**

```json
{
  "items": [
    {
      "bookId": "book_id_here",
      "quantity": 2
    }
  ]
}
```

#### GET `/api/orders`

Get order history (Student only)

**Query Parameters:**

- `status`: Filter by order status (PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED)
- `page`: Page number for pagination
- `limit`: Items per page

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## Sample Users

The database is seeded with the following test accounts:

### Teacher Admin

- Email: `teacher@institute.com`
- Password: `password123`

### Teachers

- Email: `john.doe@institute.com`
- Password: `teacher123`
- Email: `jane.smith@institute.com`
- Password: `teacher123`

### Students

- Email: `alice.johnson@student.com`
- Password: `student123`
- Email: `bob.wilson@student.com`
- Password: `student123`

## Database Management

### Setup Database

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed database with sample data
npm run db:seed
```

### View Database

```bash
# Open Prisma Studio
npx prisma studio
```

## Environment Variables

Create a `.env` file with the following variables:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
```

## Error Handling

All API endpoints return consistent error responses:

```json
{
  "error": "Error message here"
}
```

Common HTTP status codes:

- `200`: Success
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (authentication required)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Internal Server Error

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Input validation and sanitization
- SQL injection prevention (via Prisma ORM)

## Development

### Running the Development Server

```bash
npm run dev
```

### Building for Production

```bash
npm run build
npm start
```

## API Testing

You can test the API endpoints using tools like:

- Postman
- Insomnia
- curl
- Thunder Client (VS Code extension)

Example curl command for login:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice.johnson@student.com","password":"student123"}'
```

## Next Steps

1. **Frontend Integration**: Connect your existing frontend pages to these API endpoints
2. **Additional Features**: Add more endpoints as needed (user management, notifications, etc.)
3. **Production Deployment**: Set up proper environment variables and database for production
4. **Testing**: Add comprehensive test coverage
5. **Documentation**: Add OpenAPI/Swagger documentation
