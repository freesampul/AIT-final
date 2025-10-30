import { Router } from "express";
import Account from "../models/Account.js";

const router = Router();

// Create account
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "username, email, and password are required" });
    }

    const account = new Account({ username, email });
    account.password = password; // triggers hashing via virtual
    await account.save();

    return res.status(201).json({ id: account._id, username: account.username, email: account.email });
  } catch (error) {
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

    return res.status(204).end();
  } catch (_error) {
    return res.status(500).json({ error: "failed to login" });
  }
});

export default router;


