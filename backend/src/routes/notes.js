import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth); // every route in this file requires login

const noteSchema = z.object({
  title: z.string().trim().min(1).max(200),
  content: z.string().max(10000),
});

// Turns "/notes/abc" into a clean 400 instead of a database error
function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// READ all: only my notes
router.get("/", async (req, res, next) => {
  try {
    const notes = await prisma.note.findMany({
      where: { userId: req.userId },
      orderBy: { updatedAt: "desc" },
    });
    res.json(notes);
  } catch (err) {
    next(err);
  }
});

// READ one
router.get("/:id", async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid note id" });

    const note = await prisma.note.findFirst({
      where: { id, userId: req.userId },
    });
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json(note);
  } catch (err) {
    next(err);
  }
});

// CREATE: userId comes from the token, never from the request body
router.post("/", async (req, res, next) => {
  try {
    const parsed = noteSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Title is required (max 200 chars)" });
    }
    const note = await prisma.note.create({
      data: { ...parsed.data, userId: req.userId },
    });
    res.status(201).json(note);
  } catch (err) {
    next(err);
  }
});

// UPDATE: the where clause includes userId, so other users' notes never match
router.put("/:id", async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid note id" });

    const parsed = noteSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Title is required (max 200 chars)" });
    }

    const result = await prisma.note.updateMany({
      where: { id, userId: req.userId },
      data: parsed.data,
    });
    if (result.count === 0) return res.status(404).json({ error: "Note not found" });

    const updated = await prisma.note.findFirst({ where: { id, userId: req.userId } });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE
router.delete("/:id", async (req, res, next) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid note id" });

    const result = await prisma.note.deleteMany({
      where: { id, userId: req.userId },
    });
    if (result.count === 0) return res.status(404).json({ error: "Note not found" });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;