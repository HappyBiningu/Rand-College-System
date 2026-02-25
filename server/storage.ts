import { db } from "./db";
import {
  courses, userProfiles, applications, payments,
  type Course, type UserProfile, type Application, type Payment,
  type CreateCourseRequest, type UpdateCourseRequest,
  type CreateUserProfileRequest, type UpdateUserProfileRequest,
  type CreateApplicationRequest, type UpdateApplicationRequest,
  type CreatePaymentRequest
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User Profiles
  getUserProfile(userId: string): Promise<UserProfile | undefined>;
  listUserProfiles(): Promise<UserProfile[]>;
  createUserProfile(profile: CreateUserProfileRequest): Promise<UserProfile>;
  updateUserProfile(userId: string, updates: UpdateUserProfileRequest): Promise<UserProfile>;

  // Courses
  listCourses(): Promise<Course[]>;
  getCourse(id: number): Promise<Course | undefined>;
  createCourse(course: CreateCourseRequest): Promise<Course>;
  updateCourse(id: number, updates: UpdateCourseRequest): Promise<Course>;
  deleteCourse(id: number): Promise<void>;

  // Applications
  listApplications(): Promise<Application[]>;
  getApplication(id: number): Promise<Application | undefined>;
  createApplication(application: CreateApplicationRequest): Promise<Application>;
  updateApplicationStatus(id: number, status: string, notes?: string): Promise<Application>;

  // Payments
  listPayments(): Promise<Payment[]>;
  createPayment(payment: CreatePaymentRequest): Promise<Payment>;
}

export class DatabaseStorage implements IStorage {
  // User Profiles
  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));
    return profile;
  }
  async listUserProfiles(): Promise<UserProfile[]> {
    return await db.select().from(userProfiles);
  }
  async createUserProfile(profile: CreateUserProfileRequest): Promise<UserProfile> {
    const [created] = await db.insert(userProfiles).values(profile).returning();
    return created;
  }
  async updateUserProfile(userId: string, updates: UpdateUserProfileRequest): Promise<UserProfile> {
    const [updated] = await db.update(userProfiles).set(updates).where(eq(userProfiles.userId, userId)).returning();
    return updated;
  }

  // Courses
  async listCourses(): Promise<Course[]> {
    return await db.select().from(courses);
  }
  async getCourse(id: number): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course;
  }
  async createCourse(course: CreateCourseRequest): Promise<Course> {
    const [created] = await db.insert(courses).values(course).returning();
    return created;
  }
  async updateCourse(id: number, updates: UpdateCourseRequest): Promise<Course> {
    const [updated] = await db.update(courses).set(updates).where(eq(courses.id, id)).returning();
    return updated;
  }
  async deleteCourse(id: number): Promise<void> {
    await db.delete(courses).where(eq(courses.id, id));
  }

  // Applications
  async listApplications(): Promise<Application[]> {
    return await db.select().from(applications);
  }
  async getApplication(id: number): Promise<Application | undefined> {
    const [application] = await db.select().from(applications).where(eq(applications.id, id));
    return application;
  }
  async createApplication(application: CreateApplicationRequest): Promise<Application> {
    const [created] = await db.insert(applications).values(application).returning();
    return created;
  }
  async updateApplicationStatus(id: number, status: string, notes?: string): Promise<Application> {
    const updateData: any = { status };
    if (notes !== undefined) updateData.notes = notes;
    const [updated] = await db.update(applications)
      .set(updateData)
      .where(eq(applications.id, id))
      .returning();
    return updated;
  }

  // Payments
  async listPayments(): Promise<Payment[]> {
    return await db.select().from(payments);
  }
  async createPayment(payment: CreatePaymentRequest): Promise<Payment> {
    const [created] = await db.insert(payments).values(payment).returning();
    return created;
  }
}

export const storage = new DatabaseStorage();
