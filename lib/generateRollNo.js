import prisma from "@/lib/prisma";

/**
 * Generate a unique roll number for a student
 * Format: {courseCode}{year}{sequentialNumber}
 * Example: CS2024001, CS2024002, etc.
 *
 * @param {string} courseCode - Course code (e.g., "CS", "MATH")
 * @param {number} year - Academic year (e.g., 2024)
 * @returns {Promise<string>} - Unique roll number
 */
export async function generateRollNo(courseCode, year) {
  const maxAttempts = 9999;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    // Format: CS2024001, CS2024002, etc.
    const rollNo = `${courseCode}${year}${attempt.toString().padStart(3, "0")}`;

    try {
      // Check if this roll number already exists
      const existingStudent = await prisma.student.findFirst({
        where: { rollNo },
      });

      if (!existingStudent) {
        console.log(`Generated unique roll number: ${rollNo}`);
        return rollNo;
      }

      console.log(`Roll number ${rollNo} already exists, trying next...`);
    } catch (error) {
      console.error(`Error checking roll number ${rollNo}:`, error);
      // Continue to next attempt
    }
  }

  throw new Error(
    `Could not generate unique roll number after ${maxAttempts} attempts`
  );
}

/**
 * Generate a secure random password for new students
 * @returns {string} - Random 12-character password
 */
export function generateSecurePassword() {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let password = "";

  for (let i = 0; i < 12; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }

  return password;
}
