-- Update existing TEACHER and ADMIN users to TEACHER_ADMIN
UPDATE users
SET role = 'TEACHER_ADMIN'
WHERE role IN ('TEACHER', 'ADMIN');