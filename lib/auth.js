import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Alias for comparePassword to match requirement
export const verifyPassword = comparePassword;

export const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET || "fallback-secret-key",
    {
      expiresIn: "7d",
    }
  );
};

// Alias for generateToken to match requirement
export const signJwt = generateToken;

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "fallback-secret-key");
  } catch (error) {
    console.error("Token verification error:", error.message);
    return null;
  }
};

// Alias for verifyToken to match requirement
export const verifyJwt = verifyToken;

export const getTokenFromHeader = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }
  return null;
};

// Get user from request cookies (for server-side auth)
export const getUserFromRequest = (req) => {
  try {
    const token = getTokenFromHeader(req);
    if (!token) {
      // Try to get from cookies
      const cookies = req.cookies || {};
      const authCookie = cookies.authToken || cookies.token;
      if (authCookie) {
        return verifyToken(authCookie);
      }
      return null;
    }
    return verifyToken(token);
  } catch (error) {
    console.error("Error getting user from request:", error);
    return null;
  }
};

// Middleware to require teacher/admin access
export const requireTeacherAdmin = (req) => {
  const user = getUserFromRequest(req);
  if (!user) {
    throw new Error("Authentication required");
  }

  if (user.role !== "TEACHER" && user.role !== "ADMIN") {
    throw new Error("Teacher or Admin access required");
  }

  return user;
};

// Middleware to require admin access only
export const requireAdmin = (req) => {
  const user = getUserFromRequest(req);
  if (!user) {
    throw new Error("Authentication required");
  }

  if (user.role !== "ADMIN") {
    throw new Error("Admin access required");
  }

  return user;
};

// Middleware to require student access
export const requireStudent = (req) => {
  const user = getUserFromRequest(req);
  if (!user) {
    throw new Error("Authentication required");
  }

  if (user.role !== "STUDENT") {
    throw new Error("Student access required");
  }

  return user;
};
