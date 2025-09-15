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

// Get all notes for authenticated user with optional tag filtering
router.get("/", authenticateToken, async (req, res) => {
  try {
    const { tag } = req.query;
    const filter = { userId: req.user._id };

    // Add tag filter if provided
    if (tag) {
      filter.tags = tag;
    }

    const notes = await Note.find(filter).sort({
      updatedAt: -1,
    });

    // Transform response to match API design (use 'id' instead of '_id')
    const transformedNotes = notes.map((note) => ({
      id: note._id,
      title: note.title,
      content: note.content,
      tags: note.tags,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    }));

    res.json(transformedNotes);
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

    // Transform response to match API design
    const transformedNote = {
      id: note._id,
      title: note.title,
      content: note.content,
      tags: note.tags,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    };

    res.json(transformedNote);
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

    // Transform response to match API design
    const transformedNote = {
      id: note._id,
      title: note.title,
      content: note.content,
      tags: note.tags,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    };

    res.status(201).json(transformedNote);
  } catch (error) {
    console.error("Create note error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update note (full update - requires title and content)
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

    // Transform response to match API design
    const transformedNote = {
      id: note._id,
      title: note.title,
      content: note.content,
      tags: note.tags,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    };

    res.json(transformedNote);
  } catch (error) {
    console.error("Update note error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Partial update note (PATCH - as specified in API design)
router.patch("/:id", authenticateToken, async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const updateFields = {};

    // Only update provided fields
    if (title !== undefined) updateFields.title = title;
    if (content !== undefined) updateFields.content = content;
    if (tags !== undefined) updateFields.tags = tags;

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      updateFields,
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Transform response to match API design
    const transformedNote = {
      id: note._id,
      title: note.title,
      content: note.content,
      tags: note.tags,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    };

    res.json(transformedNote);
  } catch (error) {
    console.error("Patch note error:", error);
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
