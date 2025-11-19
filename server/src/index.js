import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import accountsRouter from "./routes/accounts.js";
import postsRouter from "./routes/posts.js";
import Post from "./models/Post.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const mongoUri = process.env.MONGODB_URI || "";

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/accounts", accountsRouter);
app.use("/api/posts", postsRouter);

// Simple home feed alias
app.get("/api/feed", async (_req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "username email")
      .populate("comments.user", "username email")
      .sort({ postedAt: -1 })
      .limit(100);
    
    res.json(
      posts.map((p) => {
        const postData = {
          _id: p._id,
          id: p._id,
          text: p.text,
          location: p.location || "",
          postedAt: p.postedAt,
          user: p.user,
          likes: p.likes || [],
          comments: (p.comments || []).map((c) => ({
            _id: c._id,
            text: c.text,
            user: c.user,
            createdAt: c.createdAt,
          })),
        };
        
        // Only include coordinates if they exist and are valid numbers
        if (p.latitude != null && p.longitude != null && 
            !isNaN(p.latitude) && !isNaN(p.longitude)) {
          postData.latitude = p.latitude;
          postData.longitude = p.longitude;
        }
        
        return postData;
      })
    );
  } catch (_err) {
    res.status(500).json({ error: "failed to load feed" });
  }
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

async function start() {
  try {
    if (!mongoUri) {
      console.warn("MONGODB_URI not set. Server will run without DB connection.");
    } else {
      await mongoose.connect(mongoUri, {
        dbName: "ait_social"
      });
      console.log("Connected to MongoDB");
    }

    app.listen(port, () => {
      console.log(`Server listening on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
}

start();




