import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Auth Setup
  await setupAuth(app);
  registerAuthRoutes(app);

  // User Profiles
  app.get(api.userProfiles.get.path, isAuthenticated, async (req, res) => {
    const userId = typeof req.params.userId === "string" ? req.params.userId : req.params.userId?.[0] ?? "";
    const profile = await storage.getUserProfile(userId);
    if (profile) return res.json(profile);
    // Simple login user: return default admin profile so they see all nav (Fees & Payments, etc.)
    if (userId === "tino") {
      return res.json({
        id: 0,
        userId: "tino",
        role: "admin",
        studentIdNumber: null,
        campus: null,
        idNumber: null,
        phone: null,
        address: null,
        isActive: true,
      });
    }
    return res.status(404).json({ message: "User profile not found" });
  });

  app.put(api.userProfiles.update.path, isAuthenticated, async (req, res) => {
    try {
      const userId = typeof req.params.userId === "string" ? req.params.userId : req.params.userId?.[0] ?? "";
      const input = api.userProfiles.update.input.parse(req.body);
      const existing = await storage.getUserProfile(userId);
      let profile;
      if (existing) {
        profile = await storage.updateUserProfile(userId, input);
      } else {
        profile = await storage.createUserProfile({ userId, ...input });
      }
      res.json(profile);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      throw err;
    }
  });

  app.post(api.userProfiles.create.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.userProfiles.create.input.parse(req.body);
      const profile = await storage.createUserProfile(input);
      res.status(201).json(profile);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      throw err;
    }
  });

  app.get(api.userProfiles.list.path, isAuthenticated, async (req, res) => {
    const [profiles, authUsers, applicationsList, courses] = await Promise.all([
      storage.listUserProfiles(),
      storage.listUsers(),
      storage.listApplications(),
      storage.listCourses(),
    ]);
    const withUser = profiles.map(p => {
      const approvedApp = p.role === "student"
        ? applicationsList.find(a => a.userId === p.userId && a.status === "approved")
        : null;
      const enrolledCourse = approvedApp ? courses.find(c => c.id === approvedApp.courseId)?.name ?? null : null;
      return {
        ...p,
        userAuth: authUsers.find(u => u.id === p.userId) ?? null,
        enrolledCourse,
      };
    });
    res.json(withUser);
  });

  // Courses
  app.get(api.courses.list.path, async (req, res) => {
    const courses = await storage.listCourses();
    res.json(courses);
  });

  app.post(api.courses.create.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.courses.create.input.parse(req.body);
      const course = await storage.createCourse(input);
      res.status(201).json(course);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      throw err;
    }
  });

  app.put(api.courses.update.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.courses.update.input.parse(req.body);
      const course = await storage.updateCourse(Number(req.params.id), input);
      res.json(course);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      throw err;
    }
  });

  app.delete(api.courses.delete.path, isAuthenticated, async (req, res) => {
    await storage.deleteCourse(Number(req.params.id));
    res.status(204).send();
  });

  // Applications
  app.get(api.applications.list.path, isAuthenticated, async (req, res) => {
    const [applicationsList, profiles, courses, authUsers] = await Promise.all([
      storage.listApplications(),
      storage.listUserProfiles(),
      storage.listCourses(),
      storage.listUsers(),
    ]);
    const withDetails = applicationsList.map(app => ({
      ...app,
      user: profiles.find(p => p.userId === app.userId),
      userAuth: authUsers.find(u => u.id === app.userId) ?? null,
      course: courses.find(c => c.id === app.courseId),
    }));
    res.json(withDetails);
  });

  app.post(api.applications.create.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.applications.create.input.parse(req.body);
      const application = await storage.createApplication(input);
      res.status(201).json(application);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      throw err;
    }
  });

  app.patch(api.applications.updateStatus.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.applications.updateStatus.input.parse(req.body);
      const appRecord = await storage.updateApplicationStatus(Number(req.params.id), input.status, input.notes);
      res.json(appRecord);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      throw err;
    }
  });

  // Payments
  app.get(api.payments.list.path, isAuthenticated, async (req, res) => {
    const [paymentsList, profiles, authUsers] = await Promise.all([
      storage.listPayments(),
      storage.listUserProfiles(),
      storage.listUsers(),
    ]);
    const withDetails = paymentsList.map(payment => ({
      ...payment,
      user: profiles.find(p => p.userId === payment.userId),
      userAuth: authUsers.find(u => u.id === payment.userId) ?? null,
    }));
    res.json(withDetails);
  });

  app.post(api.payments.create.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.payments.create.input.parse(req.body);
      const payment = await storage.createPayment(input);
      res.status(201).json(payment);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      throw err;
    }
  });

  // Invoices
  app.get(api.invoices.list.path, isAuthenticated, async (req, res) => {
    const [invoicesList, profiles, courses, authUsers] = await Promise.all([
      storage.listInvoices(),
      storage.listUserProfiles(),
      storage.listCourses(),
      storage.listUsers(),
    ]);
    const withDetails = invoicesList.map(inv => ({
      ...inv,
      user: profiles.find(p => p.userId === inv.userId),
      userAuth: authUsers.find(u => u.id === inv.userId) ?? null,
      course: courses.find(c => c.id === inv.courseId),
    }));
    res.json(withDetails);
  });

  app.patch("/api/invoices/:id", isAuthenticated, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const body = req.body as { status?: string; dueDate?: string | null };
      if (!body.status && body.dueDate === undefined) {
        return res.status(400).json({ message: "Provide status and/or dueDate" });
      }
      const updates: { status?: string; dueDate?: Date | null } = {};
      if (body.status) updates.status = body.status;
      if (body.dueDate !== undefined) updates.dueDate = body.dueDate ? new Date(body.dueDate) : null;
      const updated = await storage.updateInvoice(id, updates);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ message: (err as Error).message });
    }
  });

  app.post(api.invoices.create.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.invoices.create.input.parse(req.body);
      const invoice = await storage.createInvoice(input);
      res.status(201).json(invoice);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      throw err;
    }
  });

  // Dashboard Stats
  app.get(api.dashboard.stats.path, isAuthenticated, async (req, res) => {
    const profiles = await storage.listUserProfiles();
    const apps = await storage.listApplications();
    const pmts = await storage.listPayments();

    res.json({
      totalStudents: profiles.filter(p => p.role === 'student').length,
      totalApplications: apps.length,
      pendingApplications: apps.filter(a => a.status === 'pending').length,
      totalRevenue: pmts.reduce((sum, p) => sum + Number(p.amount), 0),
    });
  });

  // Seed the database if empty
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingCourses = await storage.listCourses();
  if (existingCourses.length === 0) {
    await storage.createCourse({
      name: "Traffic Management", faculty: "Traffic", campus: "Springs", duration: "1 Year",
      registrationFee: "500", depositFee: "700", monthlyInstallment: "1800", totalCost: "22800"
    });
    await storage.createCourse({
      name: "Electrical Engineering", faculty: "Engineering", campus: "Springs", duration: "18 Months",
      registrationFee: "500", depositFee: "700", monthlyInstallment: "1600", totalCost: "30000"
    });
    await storage.createCourse({
      name: "Business Management", faculty: "Business", campus: "Springs", duration: "18 Months",
      registrationFee: "500", depositFee: "700", monthlyInstallment: "1500", totalCost: "28200"
    });
    await storage.createCourse({
      name: "Information Technology", faculty: "Computer Science", campus: "JHB", duration: "1 Year",
      registrationFee: "500", depositFee: "3000", monthlyInstallment: "1800", totalCost: "25100"
    });
  }
}
