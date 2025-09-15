import express from "express";
import jwt from "jsonwebtoken";
import Note from "../models/Note.js";
import User from "../models/User.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Access token required" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(403).json({ message: "Invalid token" });
    }
    console.error("Auth middleware error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all notes for authenticated user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user._id }).sort({
      updatedAt: -1,
    });
    res.json(notes);
  } catch (error) {
    console.error("Get notes error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get single note by ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json(note);
  } catch (error) {
    console.error("Get note error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Create new note
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    const note = new Note({
      userId: req.user._id,
      title,
      content,
      tags: tags || [],
    });

    await note.save();
    res.status(201).json(note);
  } catch (error) {
    console.error("Create note error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update note
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { title, content, tags: tags || [] },
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json(note);
  } catch (error) {
    console.error("Update note error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete note
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Delete note error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
