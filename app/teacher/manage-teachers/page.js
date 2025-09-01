"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function TeacherManagement() {
  const { user, isAuthenticated, hasRole } = useAuth();
  const router = useRouter();
  const [teacherRequests, setTeacherRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState({});
  const [rejectReason, setRejectReason] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);

  // Check authentication and role
  useEffect(() => {
    if (!isAuthenticated || !hasRole(["TEACHER", "ADMIN"])) {
      router.push("/teacher-login");
      return;
    }

    fetchTeacherRequests();
  }, [isAuthenticated, hasRole, router]);

  const fetchTeacherRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/teacher-requests?status=PENDING", {
        credentials: "include",
      });

      const data = await response.json();

      if (data.ok) {
        setTeacherRequests(data.data.teacherRequests);
      } else {
        setError(data.message || "Failed to fetch teacher requests");
      }
    } catch (error) {
      console.error("Error fetching teacher requests:", error);
      setError("Failed to fetch teacher requests");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      setActionLoading((prev) => ({ ...prev, [requestId]: true }));

      const response = await fetch(`/api/teachers/${requestId}/approve`, {
        method: "PATCH",
        credentials: "include",
      });

      const data = await response.json();

      if (data.ok) {
        // Show success message with credentials
        const credentials = data.data.credentials;
        alert(
          `Teacher request approved successfully!\n\nTeacher Credentials:\nEmail: ${credentials.email}\nPassword: ${credentials.password}\n\nPlease share these credentials with the teacher.`
        );

        // Refresh the list
        fetchTeacherRequests();
      } else {
        alert(`Failed to approve teacher request: ${data.message}`);
      }
    } catch (error) {
      console.error("Error approving teacher request:", error);
      alert("Failed to approve teacher request");
    } finally {
      setActionLoading((prev) => ({ ...prev, [requestId]: false }));
    }
  };

  const handleReject = async (requestId, reason) => {
    try {
      setActionLoading((prev) => ({ ...prev, [requestId]: true }));

      const response = await fetch(`/api/teachers/${requestId}/reject`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason }),
        credentials: "include",
      });

      const data = await response.json();

      if (data.ok) {
        alert("Teacher request rejected successfully");
        setShowRejectModal(false);
        setRejectReason("");
        setSelectedRequest(null);

        // Refresh the list
        fetchTeacherRequests();
      } else {
        alert(`Failed to reject teacher request: ${data.message}`);
      }
    } catch (error) {
      console.error("Error rejecting teacher request:", error);
      alert("Failed to reject teacher request");
    } finally {
      setActionLoading((prev) => ({ ...prev, [requestId]: false }));
    }
  };

  const openRejectModal = (request) => {
    setSelectedRequest(request);
    setShowRejectModal(true);
  };

  const closeRejectModal = () => {
    setShowRejectModal(false);
    setRejectReason("");
    setSelectedRequest(null);
  };

  if (!isAuthenticated || !hasRole(["TEACHER", "ADMIN"])) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Teacher Management
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Review and manage teacher registration requests
              </p>
            </div>
            <button
              onClick={() => router.push("/teacher-dashboard")}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-yellow-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">⏳</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Pending Requests
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {
                        teacherRequests.filter(
                          (req) => req.status === "PENDING"
                        ).length
                      }
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">✅</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Approved Today
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {
                        teacherRequests.filter(
                          (req) =>
                            req.status === "APPROVED" &&
                            new Date(req.updatedAt).toDateString() ===
                              new Date().toDateString()
                        ).length
                      }
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">❌</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Rejected Today
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {
                        teacherRequests.filter(
                          (req) =>
                            req.status === "REJECTED" &&
                            new Date(req.updatedAt).toDateString() ===
                              new Date().toDateString()
                        ).length
                      }
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Teacher Requests Table */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Pending Teacher Registration Requests
            </h3>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading teacher requests...</p>
              </div>
            ) : teacherRequests.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  No pending teacher registration requests found.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Teacher
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Applied
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {teacherRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {request.firstName} {request.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {request.qualification &&
                                `Qualification: ${request.qualification}`}
                            </div>
                            {request.experience && (
                              <div className="text-sm text-gray-500">
                                Experience: {request.experience}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {request.department}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm text-gray-900">
                              {request.email}
                            </div>
                            {request.phone && (
                              <div className="text-sm text-gray-500">
                                {request.phone}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleApprove(request.id)}
                              disabled={actionLoading[request.id]}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              {actionLoading[request.id]
                                ? "Processing..."
                                : "Approve"}
                            </button>
                            <button
                              onClick={() => openRejectModal(request)}
                              disabled={actionLoading[request.id]}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              {actionLoading[request.id]
                                ? "Processing..."
                                : "Reject"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Reject Teacher Request
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to reject the request for{" "}
                <strong>
                  {selectedRequest?.firstName} {selectedRequest?.lastName}
                </strong>
                ?
              </p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Rejection (Optional)
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter reason for rejection..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeRejectModal}
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReject(selectedRequest.id, rejectReason)}
                  disabled={actionLoading[selectedRequest.id]}
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {actionLoading[selectedRequest.id]
                    ? "Processing..."
                    : "Reject"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
