import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import notesRoutes from "./routes/notes.js";

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// MongoDB connection using mongoose
const MONGODB_URI = process.env.MONGODB_URI || "";

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB successfully.");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// Initialize MongoDB connection
connectToMongoDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/api/notes", notesRoutes);

app.get("/", (req, res) => {
  res.send("NotesVault backend is running!");
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
