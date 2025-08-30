const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Network error" }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Get auth token from localStorage
const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken");
  }
  return null;
};

// Set auth token in localStorage
const setAuthToken = (token) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("authToken", token);
  }
};

// Remove auth token from localStorage
const removeAuthToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken");
  }
};

// API request helper
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();

  if (!token && !endpoint.includes("/auth/")) {
    throw new Error("Authentication required");
  }

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  return handleResponse(response);
};

// Authentication API calls
export const authAPI = {
  // Register a new user
  register: async (userData) => {
    const response = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });

    if (response.token) {
      setAuthToken(response.token);
    }

    return response;
  },

  // Login user (for teachers/admins)
  login: async (credentials) => {
    const response = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    if (response.token) {
      setAuthToken(response.token);
    }

    return response;
  },

  // Student login with Student ID
  studentLogin: async (studentId) => {
    const response = await apiRequest("/auth/student-login", {
      method: "POST",
      body: JSON.stringify({ studentId }),
    });

    if (response.token) {
      setAuthToken(response.token);
    }

    return response;
  },

  // Logout user
  logout: () => {
    removeAuthToken();
  },

  // Get current user (if token exists)
  getCurrentUser: () => {
    const token = getAuthToken();
    if (!token) return null;

    try {
      // Decode JWT token to get user info
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload;
    } catch (error) {
      removeAuthToken();
      return null;
    }
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

  // Get admission applications (for admin/teachers)
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

  // Add new book (admin/teacher only)
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
export { getAuthToken, setAuthToken, removeAuthToken };
