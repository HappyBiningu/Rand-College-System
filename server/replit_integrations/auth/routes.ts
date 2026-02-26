import type { Express } from "express";
import { authStorage } from "./storage";
import { isAuthenticated } from "./replitAuth";

// Register auth-specific routes
export function registerAuthRoutes(app: Express): void {
  // Get current authenticated user
  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id ?? req.user?.claims?.sub;
      const user = await authStorage.getUser(userId);
      if (!user) {
        return res.json({ id: req.user?.id ?? userId, email: null, firstName: null, lastName: null, profileImageUrl: null });
      }
      res.json(user);
    } catch (error) {
      const id = req.user?.id ?? req.user?.claims?.sub;
      if (id) {
        return res.json({ id, email: null, firstName: null, lastName: null, profileImageUrl: null });
      }
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
}
