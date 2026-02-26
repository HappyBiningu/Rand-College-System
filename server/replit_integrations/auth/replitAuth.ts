import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import { authStorage } from "./storage";

const AUTH_USERNAME = "tino";
const AUTH_PASSWORD = "rand123";

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const secret =
    process.env.SESSION_SECRET?.trim() || "dev-session-secret-change-in-production";
  const store =
    process.env.DATABASE_URL?.trim()
      ? (() => {
          const pgStore = connectPg(session);
          return new pgStore({
            conString: process.env.DATABASE_URL,
            createTableIfMissing: false,
            ttl: sessionTtl,
            tableName: "sessions",
          });
        })()
      : undefined;
  return session({
    secret,
    store,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: sessionTtl,
    },
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      if (username === AUTH_USERNAME && password === AUTH_PASSWORD) {
        try {
          await authStorage.upsertUser({
            id: AUTH_USERNAME,
            email: null,
            firstName: null,
            lastName: null,
            profileImageUrl: null,
          });
        } catch {
          // DB unreachable; login still succeeds
        }
        return done(null, { id: AUTH_USERNAME, username: AUTH_USERNAME });
      }
      return done(null, false, { message: "Invalid username or password" });
    })
  );

  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  app.get("/api/login", (_req, res) => {
    res.redirect("/");
  });

  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: info?.message || "Invalid credentials" });
      req.login(user, (loginErr) => {
        if (loginErr) return next(loginErr);
        return res.json({ success: true, user });
      });
    })(req, res, next);
  });

  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect("/");
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  return next();
};
