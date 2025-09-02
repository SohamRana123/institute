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
    console.log("Verifying token:", token ? token.substring(0, 10) + '...' : 'null');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret-key");
    console.log("Token verified successfully:", decoded);
    return decoded;
  } catch (error) {
    console.error("Token verification error:", error.message);
    return null;
  }
};

// Alias for verifyToken to match requirement
export const verifyJwt = verifyToken;

export const getTokenFromHeader = (req) => {
  // First try to get token from Authorization header
  const authHeader = req.headers.get ? req.headers.get('authorization') : req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }
  
  // If no token in header, try to get from cookies
  try {
    // For Next.js API routes (req.cookies is an object)
    if (req.cookies && typeof req.cookies === 'object') {
      const authCookie = req.cookies.authToken || req.cookies.token || req.cookies.auth_token_client;
      if (authCookie && typeof authCookie === 'string') {
        return authCookie;
      } else if (authCookie && authCookie.value) {
        return authCookie.value;
      }
    }
    
    // For Next.js middleware (req.cookies is a Map-like object with get method)
    if (req.cookies && typeof req.cookies.get === 'function') {
      const authToken = req.cookies.get('authToken');
      const token = req.cookies.get('token');
      const authTokenClient = req.cookies.get('auth_token_client');
      
      if (authToken?.value) return authToken.value;
      if (token?.value) return token.value;
      if (authTokenClient?.value) return authTokenClient.value;
    }
  } catch (error) {
    console.error('Error getting token from cookies:', error);
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
