import { NextResponse } from "next/server";
import { verifyJwt } from "@/lib/auth";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Check if the route needs protection
  const isProtectedRoute =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/teacher") ||
    pathname.startsWith("/teacher-dashboard");

  console.log(`Middleware checking route: ${pathname}, protected: ${isProtectedRoute}`);

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  try {
    // Get token from cookie
    const cookies = request.cookies.getAll();
    console.log(`All cookies:`, cookies.map(c => `${c.name}=${c.value ? 'present' : 'empty'}`));
    
    // Try to get token from various sources in order of preference
    let token = request.cookies.get("authToken")?.value;
    let tokenSource = "authToken cookie";
    
    if (!token) {
      token = request.cookies.get("token")?.value;
      if (token) tokenSource = "token cookie";
    }
    
    // If no token in cookies, check Authorization header
    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
        tokenSource = "Authorization header";
        console.log(`Using token from ${tokenSource}, length:`, token.length);
        
        // For Authorization header auth, we need to set the token in the response cookies
        // so that client-side JavaScript can access it after the redirect
        const response = NextResponse.next();
        response.cookies.set("authToken", token, {
          httpOnly: true,
          secure: false, // Set to false for localhost testing
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: "/",
        });
        
        // Also set a non-HttpOnly cookie for client-side access
        response.cookies.set("auth_token_client", token, {
          httpOnly: false,
          secure: false,
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: "/",
        });
        
        return response;
      }
    }
    
    // Also check for auth_token_client cookie (non-HttpOnly version for client-side access)
    if (!token) {
      token = request.cookies.get("auth_token_client")?.value;
      if (token) {
        tokenSource = "auth_token_client cookie";
        
        // When using auth_token_client, also set the httpOnly authToken cookie
        // This ensures server-side middleware can access it on subsequent requests
        const response = NextResponse.next();
        response.cookies.set("authToken", token, {
          httpOnly: true,
          secure: false, // Set to false for localhost testing
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: "/",
        });
        
        return response;
      }
    }
    
    console.log(`Auth token found: ${!!token}, source: ${tokenSource}, length: ${token?.length || 0}`);
    
    console.log(`Auth token found: ${!!token}, token length: ${token?.length || 0}`);
    
    // Log the full cookie header for debugging
    const cookieHeader = request.headers.get('cookie');
    console.log(`Raw Cookie header: ${cookieHeader}`);
    
    // Log the request URL and origin for debugging
    console.log(`Request URL: ${request.url}`);
    console.log(`Request method: ${request.method}`);
    console.log(`Request headers:`, Object.fromEntries(request.headers.entries()));

    if (!token) {
      console.log("No auth token found, redirecting to login");
      // Create a response object to redirect
      const response = NextResponse.redirect(new URL("/teacher-login", request.url));
      
      // Clear any potentially invalid auth cookies
      response.cookies.set("authToken", "", {
        httpOnly: true,
        secure: false, // Set to false for localhost testing
        sameSite: "lax", // Ensure consistent cookie settings
        maxAge: 0,
        path: "/",
      });
      
      return response;
    }

    // Verify JWT token
    const decoded = verifyJwt(token);
    console.log(`Token verification result:`, decoded ? `valid for user ${decoded.userId}` : 'invalid');

    if (!decoded) {
      console.log("Invalid token, redirecting to login");
      // Create a response object to redirect
      const response = NextResponse.redirect(new URL("/teacher-login", request.url));
      
      // Clear the invalid auth cookie
      response.cookies.set("authToken", "", {
        httpOnly: true,
        secure: false, // Set to false for localhost testing
        sameSite: "lax", // Ensure consistent cookie settings
        maxAge: 0,
        path: "/",
      });
      
      return response;
    }

    // Check if user has required role (TEACHER or ADMIN)
    console.log(`User role: ${decoded.role}`);
    if (decoded.role !== "TEACHER" && decoded.role !== "ADMIN") {
      console.log("Insufficient permissions, redirecting to login");
      const response = NextResponse.redirect(new URL("/teacher-login", request.url));
      
      // Clear the invalid auth cookie for users with insufficient permissions
      response.cookies.set("authToken", "", {
        httpOnly: true,
        secure: false, // Set to false for localhost testing
        sameSite: "lax", // Ensure consistent cookie settings
        maxAge: 0,
        path: "/",
      });
      
      return response;
    }

    // User is authenticated and authorized, proceed
    console.log(
      `User ${decoded.userId} (${decoded.role}) accessing ${pathname}`
    );
    
    // Clone the request headers to the response
    const response = NextResponse.next();
    
    // Add user info to response headers for debugging
    response.headers.set("x-user-id", decoded.userId);
    response.headers.set("x-user-role", decoded.role);
    
    return response;
  } catch (error) {
    console.error("Middleware error:", error);
    // Create a response object to redirect
    const response = NextResponse.redirect(new URL("/teacher-login", request.url));
    
    // Clear any potentially invalid auth cookies
    response.cookies.set("authToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
      path: "/",
    });
    
    return response;
  }
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/teacher/:path*",
    "/teacher-dashboard/:path*",
    "/teacher-dashboard",
  ],
};
