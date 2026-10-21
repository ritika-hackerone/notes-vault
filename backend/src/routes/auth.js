import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";

const router = Router();

const credentials = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).max(72), // bcrypt ignores everything after 72 bytes
});

// A throwaway hash so login takes the same time whether or not the email exists
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 12);

router.post("/register", async (req, res, next) => {
  try {
    const parsed = credentials.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ error: "Enter a valid email and a password of 8 to 72 characters" });
    }
    const { email, password } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, 12);

    try {
      const user = await prisma.user.create({ data: { email, passwordHash } });
      return res.status(201).json({ id: user.id, email: user.email });
    } catch (err) {
      // Two simultaneous signups with the same email: the unique index catches the loser
      if (err.code === "P2002") {
        return res.status(409).json({ error: "Email already registered" });
      }
      throw err;
    }
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const parsed = credentials.safeParse(req.body);
    if (!parsed.success) return res.status(401).json({ error: "Invalid credentials" });
    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    const ok = await bcrypt.compare(password, user ? user.passwordHash : DUMMY_HASH);

    if (!user || !ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ sub: String(user.id) }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    next(err);
  }
});

export default router;