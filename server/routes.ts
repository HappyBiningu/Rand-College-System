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
    const profile = await storage.getUserProfile(req.params.userId);
    if (!profile) {
      return res.status(404).json({ message: "User profile not found" });
    }
    res.json(profile);
  });

  app.put(api.userProfiles.update.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.userProfiles.update.input.parse(req.body);
      const existing = await storage.getUserProfile(req.params.userId);
      let profile;
      if (existing) {
        profile = await storage.updateUserProfile(req.params.userId, input);
      } else {
        profile = await storage.createUserProfile({ userId: req.params.userId, ...input });
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
    const profiles = await storage.listUserProfiles();
    res.json(profiles);
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
    const applications = await storage.listApplications();
    const profiles = await storage.listUserProfiles();
    const courses = await storage.listCourses();

    const withDetails = applications.map(app => ({
      ...app,
      user: profiles.find(p => p.userId === app.userId),
      course: courses.find(c => c.id === app.courseId)
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
    const payments = await storage.listPayments();
    const profiles = await storage.listUserProfiles();
    
    const withDetails = payments.map(payment => ({
      ...payment,
      user: profiles.find(p => p.userId === payment.userId)
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
    const invoices = await storage.listInvoices();
    const profiles = await storage.listUserProfiles();
    const courses = await storage.listCourses();

    const withDetails = invoices.map(inv => ({
      ...inv,
      user: profiles.find(p => p.userId === inv.userId),
      course: courses.find(c => c.id === inv.courseId)
    }));
    
    res.json(withDetails);
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
