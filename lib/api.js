const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

// Handle API response
const handleResponse = async (response) => {
  // If response is already an object (from our error handling), return it
  if (
    response &&
    typeof response === "object" &&
    !response.ok &&
    !response.json
  ) {
    return response;
  }

  let data;
  try {
    data = await response.json();
    console.log("Response data:", JSON.stringify(data, null, 2));
    
    // No need to handle token storage as it's now managed by httpOnly cookies
  } catch (error) {
    console.error("Error parsing response JSON:", error);
    return { error: "Invalid response format" };
  }

  if (!response.ok) {
    console.error("API error:", data.message || data.error || "Unknown error");
    return {
      ok: false,
      error: data.message || data.error || "Something went wrong",
      status: response.status,
      data: data // Include the full response data for more context
    };
  }

  return data;
};

// No longer needed to get auth token from localStorage as we're using cookies only
const getAuthToken = () => {
  // This function is kept for backward compatibility but returns null
  // as we're now using httpOnly cookies exclusively
  console.log("getAuthToken called, but we're using cookies only now");
  return null;
};

// No longer needed to set auth token in localStorage as we're using cookies only
const setAuthToken = (token) => {
  // This function is kept for backward compatibility but does nothing
  // as we're now using httpOnly cookies exclusively
  console.log("setAuthToken called, but we're using cookies only now");
  // No action needed as the token is set as httpOnly cookie by the server
};

// No longer needed to remove auth token from localStorage as we're using cookies only
const removeAuthToken = () => {
  // This function is kept for backward compatibility but does nothing
  // as we're now using httpOnly cookies exclusively
  console.log("removeAuthToken called, but we're using cookies only now");
  // No action needed as the token is managed as httpOnly cookie by the server
};

// API request helper
const apiRequest = async (endpoint, options = {}) => {
  // We're now using cookies exclusively for authentication
  // No need to manually get or set the token
  
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include", // Always include cookies for authentication
    ...options,
  };

  console.log(`Making API request to: ${endpoint} with cookies for authentication`);


  console.log(`Making API request to: ${API_BASE_URL}${endpoint}`);
  console.log("Request config:", JSON.stringify(config, null, 2));

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    console.log(`Response status: ${response.status}`);

    return handleResponse(response);
  } catch (error) {
    console.error("API request error:", error);
    return {
      ok: false,
      message: error.message || "An error occurred during the API request",
    };
  }
};

// Authentication API calls
export const authAPI = {
  // Register a new user
  register: async (userData) => {
    const response = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });

    return response;
  },

  // Login user (for teachers)
  login: async (credentials) => {
    try {
      const response = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });

      // Check if there was an error
      if (!response.ok) {
        console.error("Login API error:", response.message || response.error || response.error);
        return { success: false, error: response.message || response.error };
      }

      console.log("Login successful, user data:", response.data);
      
      // No need to handle token storage as it's now managed by httpOnly cookies
      // The server sets the cookie automatically in the response
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Login API exception:", error);
      return { success: false, error: error.message || "Login request failed" };
    }
  },

  // Student login with Student ID
  studentLogin: async (studentId) => {
    const response = await apiRequest("/auth/student-login", {
      method: "POST",
      body: JSON.stringify({ studentId }),
    });

    return response;
  },

  // Logout user
  logout: async () => {
    try {
      const response = await apiRequest("/auth/logout", {
        method: "POST",
      });
      
      // No need to manually remove tokens as the server will clear the cookie
      return response;
    } catch (error) {
      console.error("Logout error:", error);
      return { success: false, error: error.message };
    }
  },

  // Get current user from server (using cookies and token)
  getCurrentUser: async () => {
    try {
      const response = await apiRequest("/auth/me");

      // Check if response has data property and user inside it
      if (response && response.data && response.data.user) {
        return response.data.user;
      }
      
      // Check if response itself is the user object
      if (response && response.id && response.role) {
        return response;
      }
      
      console.log("No valid user data in response:", response);
      return null;
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  },

  // Get all users (for teachers)
  getUsers: async () => {
    return await apiRequest("/auth/users");
  },
};

// Admissions API calls
export const admissionsAPI = {
  // Submit admission application
  submitApplication: async (applicationData) => {
    return await apiRequest("/admissions", {
      method: "POST",
      body: JSON.stringify(applicationData),
    });
  },

  // Get admission applications (for teachers)
  getApplications: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    return await apiRequest(`/admissions?${params}`);
  },
};

// Books API calls
export const booksAPI = {
  // Get all books
  getBooks: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    return await apiRequest(`/books?${params}`);
  },

  // Add new book (teacher only)
  addBook: async (bookData) => {
    return await apiRequest("/books", {
      method: "POST",
      body: JSON.stringify(bookData),
    });
  },
};

// Orders API calls
export const ordersAPI = {
  // Create new order
  createOrder: async (orderData) => {
    return await apiRequest("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  },

  // Get order history
  getOrders: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    return await apiRequest(`/orders?${params}`);
  },
};

// Performance API calls
export const performanceAPI = {
  // Get student performance
  getPerformance: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    return await apiRequest(`/performance?${params}`);
  },

  // Add performance record (teacher only)
  addPerformance: async (performanceData) => {
    return await apiRequest("/performance", {
      method: "POST",
      body: JSON.stringify(performanceData),
    });
  },
};

// Courses API calls
export const coursesAPI = {
  // Get all courses
  getCourses: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    return await apiRequest(`/courses?${params}`);
  },

  // Create new course (teacher only)
  createCourse: async (courseData) => {
    return await apiRequest("/courses", {
      method: "POST",
      body: JSON.stringify(courseData),
    });
  },
};

// Enrollments API calls
export const enrollmentsAPI = {
  // Enroll in a course
  enrollInCourse: async (courseId) => {
    return await apiRequest("/enrollments", {
      method: "POST",
      body: JSON.stringify({ courseId }),
    });
  },

  // Get enrollments
  getEnrollments: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    return await apiRequest(`/enrollments?${params}`);
  },
};

// Export utility functions
export { getAuthToken, setAuthToken, removeAuthToken, apiRequest };
