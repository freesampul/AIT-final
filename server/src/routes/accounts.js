import { Router } from "express";
import Account from "../models/Account.js";
import bcrypt from "bcrypt";

const router = Router();

// List all accounts (for testing)
router.get("/", async (_req, res) => {
  try {
    const accounts = await Account.find().select("username email createdAt").limit(50);
    res.json(accounts);
  } catch (_err) {
    res.status(500).json({ error: "failed to fetch accounts" });
  }
});

// Create account
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "username, email, and password are required" });
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHash = await bcrypt.hash(password, salt);
    
    const account = new Account({ username, email, passwordHash });
    await account.save();

    return res.status(201).json({ id: account._id, username: account.username, email: account.email });
  } catch (error) {
    console.error("Registration error:", error);
    if (error.code === 11000) {
      return res.status(409).json({ error: "username or email already exists" });
    }
    return res.status(500).json({ error: "failed to register" });
  }
});

// Basic login (no JWT; returns 204 if ok)
router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier can be username or email
    if (!identifier || !password) {
      return res.status(400).json({ error: "identifier and password are required" });
    }

    const account = await Account.findOne({
      $or: [{ username: identifier }, { email: identifier.toLowerCase() }],
    });
    if (!account) return res.status(401).json({ error: "invalid credentials" });

    const ok = await account.comparePassword(password);
    if (!ok) return res.status(401).json({ error: "invalid credentials" });

    return res.json({ id: account._id, username: account.username, email: account.email });
  } catch (_error) {
    return res.status(500).json({ error: "failed to login" });
  }
});

export default router;


