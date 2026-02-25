import { z } from "zod";
import { insertUserProfileSchema, insertCourseSchema, insertApplicationSchema, insertPaymentSchema, courses, userProfiles, applications, payments } from "./schema";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  })
};

export const api = {
  userProfiles: {
    get: {
      method: "GET" as const,
      path: "/api/user-profiles/:userId" as const,
      responses: {
        200: z.custom<typeof userProfiles.$inferSelect>(),
        404: errorSchemas.notFound,
      }
    },
    update: {
      method: "PUT" as const,
      path: "/api/user-profiles/:userId" as const,
      input: insertUserProfileSchema.partial(),
      responses: {
        200: z.custom<typeof userProfiles.$inferSelect>(),
        400: errorSchemas.validation,
      }
    },
    list: {
      method: "GET" as const,
      path: "/api/user-profiles" as const,
      responses: {
        200: z.array(z.custom<typeof userProfiles.$inferSelect>()),
      }
    }
  },
  courses: {
    list: {
      method: "GET" as const,
      path: "/api/courses" as const,
      responses: {
        200: z.array(z.custom<typeof courses.$inferSelect>()),
      }
    },
    create: {
      method: "POST" as const,
      path: "/api/courses" as const,
      input: insertCourseSchema,
      responses: {
        201: z.custom<typeof courses.$inferSelect>(),
        400: errorSchemas.validation,
      }
    },
    update: {
      method: "PUT" as const,
      path: "/api/courses/:id" as const,
      input: insertCourseSchema.partial(),
      responses: {
        200: z.custom<typeof courses.$inferSelect>(),
        400: errorSchemas.validation,
      }
    },
    delete: {
      method: "DELETE" as const,
      path: "/api/courses/:id" as const,
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      }
    }
  },
  applications: {
    list: {
      method: "GET" as const,
      path: "/api/applications" as const,
      responses: {
        200: z.array(z.any()), // Can be cast to ApplicationWithDetails
      }
    },
    create: {
      method: "POST" as const,
      path: "/api/applications" as const,
      input: insertApplicationSchema,
      responses: {
        201: z.custom<typeof applications.$inferSelect>(),
        400: errorSchemas.validation,
      }
    },
    updateStatus: {
      method: "PATCH" as const,
      path: "/api/applications/:id/status" as const,
      input: z.object({ status: z.string(), notes: z.string().optional() }),
      responses: {
        200: z.custom<typeof applications.$inferSelect>(),
        404: errorSchemas.notFound,
      }
    }
  },
  payments: {
    list: {
      method: "GET" as const,
      path: "/api/payments" as const,
      responses: {
        200: z.array(z.any()), // PaymentWithDetails
      }
    },
    create: {
      method: "POST" as const,
      path: "/api/payments" as const,
      input: insertPaymentSchema,
      responses: {
        201: z.custom<typeof payments.$inferSelect>(),
        400: errorSchemas.validation,
      }
    }
  },
  dashboard: {
    stats: {
      method: "GET" as const,
      path: "/api/dashboard/stats" as const,
      responses: {
        200: z.object({
          totalStudents: z.number(),
          totalApplications: z.number(),
          totalRevenue: z.number(),
          pendingApplications: z.number()
        })
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
