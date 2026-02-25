export * from "./models/auth";
import { pgTable, text, serial, integer, timestamp, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().unique(), // Links to users.id
  role: text("role").notNull().default("student"), // 'admin', 'clerk', 'faculty', 'student'
  studentIdNumber: text("student_id_number").unique(),
  campus: text("campus"), // 'Springs', 'Braamfontein', 'JHB'
  idNumber: text("id_number"),
  phone: text("phone"),
  address: text("address"),
});

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  faculty: text("faculty").notNull(), 
  duration: text("duration"),
  campus: text("campus"), 
  registrationFee: numeric("registration_fee").notNull(),
  depositFee: numeric("deposit_fee"),
  monthlyInstallment: numeric("monthly_instalment"),
  totalCost: numeric("total_cost").notNull(),
});

export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  courseId: integer("course_id").notNull(),
  status: text("status").notNull().default("pending"), // 'pending', 'approved', 'rejected'
  applicationDate: timestamp("application_date").defaultNow(),
  notes: text("notes"),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  amount: numeric("amount").notNull(),
  paymentDate: timestamp("payment_date").defaultNow(),
  receiptNumber: text("receipt_number").notNull(),
  status: text("status").notNull().default("completed"),
  description: text("description"), 
});

// Zod schemas
export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({ id: true });
export const insertCourseSchema = createInsertSchema(courses).omit({ id: true });
export const insertApplicationSchema = createInsertSchema(applications).omit({ id: true, applicationDate: true });
export const insertPaymentSchema = createInsertSchema(payments).omit({ id: true, paymentDate: true });

// Types
export type UserProfile = typeof userProfiles.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type Application = typeof applications.$inferSelect;
export type Payment = typeof payments.$inferSelect;

export type CreateUserProfileRequest = z.infer<typeof insertUserProfileSchema>;
export type UpdateUserProfileRequest = Partial<CreateUserProfileRequest>;

export type CreateCourseRequest = z.infer<typeof insertCourseSchema>;
export type UpdateCourseRequest = Partial<CreateCourseRequest>;

export type CreateApplicationRequest = z.infer<typeof insertApplicationSchema>;
export type UpdateApplicationRequest = Partial<CreateApplicationRequest>;

export type CreatePaymentRequest = z.infer<typeof insertPaymentSchema>;
