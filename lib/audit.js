import prisma from "./prisma";

/**
 * Audit action types for tracking system activities
 */
export const AUDIT_ACTIONS = {
  // User related actions
  USER_LOGIN: "USER_LOGIN",
  USER_LOGOUT: "USER_LOGOUT",
  USER_CREATED: "USER_CREATED",
  USER_UPDATED: "USER_UPDATED",
  
  // Admission related actions
  ADMISSION_SUBMITTED: "ADMISSION_SUBMITTED",
  ADMISSION_APPROVED: "ADMISSION_APPROVED",
  ADMISSION_REJECTED: "ADMISSION_REJECTED",
  
  // Teacher related actions
  TEACHER_REQUEST_SUBMITTED: "TEACHER_REQUEST_SUBMITTED",
  TEACHER_REQUEST_APPROVED: "TEACHER_REQUEST_APPROVED",
  TEACHER_REQUEST_REJECTED: "TEACHER_REQUEST_REJECTED",
  
  // Course related actions
  COURSE_CREATED: "COURSE_CREATED",
  COURSE_UPDATED: "COURSE_UPDATED",
  COURSE_DELETED: "COURSE_DELETED",
  
  // Curriculum related actions
  CURRICULUM_UPLOADED: "CURRICULUM_UPLOADED",
  CURRICULUM_UPDATED: "CURRICULUM_UPDATED",
  CURRICULUM_DELETED: "CURRICULUM_DELETED",
  
  // Performance related actions
  PERFORMANCE_UPLOADED: "PERFORMANCE_UPLOADED",
  PERFORMANCE_UPDATED: "PERFORMANCE_UPDATED",
  
  // Book related actions
  BOOK_CREATED: "BOOK_CREATED",
  BOOK_UPDATED: "BOOK_UPDATED",
  BOOK_DELETED: "BOOK_DELETED",
  
  // Order related actions
  ORDER_PLACED: "ORDER_PLACED",
  ORDER_UPDATED: "ORDER_UPDATED",
  ORDER_CANCELLED: "ORDER_CANCELLED"
};

/**
 * Log an action to the audit log
 * @param {Object} params - Parameters for the audit log
 * @param {string} params.action - The action being performed (use AUDIT_ACTIONS constants)
 * @param {string} params.entity - The entity type being affected (e.g., 'user', 'book', 'course')
 * @param {string} [params.entityId] - The ID of the entity being affected
 * @param {string} [params.userId] - The ID of the user performing the action
 * @param {Object} [params.meta] - Additional metadata about the action
 * @returns {Promise<Object>} - The created audit log entry
 */
export async function logAction({ action, entity, entityId, userId, meta }) {
  try {
    const auditLog = await prisma.auditLog.create({
      data: {
        action,
        entity,
        entityId,
        userId,
        meta,
      },
    });
    
    return auditLog;
  } catch (error) {
    console.error("Error logging action to audit log:", error);
    // Don't throw the error to prevent disrupting the main application flow
    return null;
  }
}

/**
 * Get audit logs with filtering options
 * @param {Object} options - Filter options
 * @param {string} [options.userId] - Filter by user ID
 * @param {string} [options.action] - Filter by action type
 * @param {string} [options.entity] - Filter by entity type
 * @param {string} [options.entityId] - Filter by entity ID
 * @param {Date} [options.startDate] - Filter by start date
 * @param {Date} [options.endDate] - Filter by end date
 * @param {number} [options.page=1] - Page number for pagination
 * @param {number} [options.limit=20] - Number of items per page
 * @returns {Promise<Object>} - Paginated audit logs and count
 */
export async function getAuditLogs(options = {}) {
  const {
    userId,
    action,
    entity,
    entityId,
    startDate,
    endDate,
    page = 1,
    limit = 20,
  } = options;

  const skip = (page - 1) * limit;
  
  // Build the where clause based on provided filters
  const where = {};
  
  if (userId) where.userId = userId;
  if (action) where.action = action;
  if (entity) where.entity = entity;
  if (entityId) where.entityId = entityId;
  
  // Date range filter
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = startDate;
    if (endDate) where.createdAt.lte = endDate;
  }

  try {
    // Get audit logs with pagination
    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.auditLog.count({ where }),
    ]);

    return {
      logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    throw error;
  }
}