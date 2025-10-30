import { Router } from "express";
import Post from "../models/Post.js";
import Account from "../models/Account.js";

const router = Router();

// Create post
router.post("/", async (req, res) => {
  try {
    const { text, location, userId, postedAt } = req.body;
    if (!text || !userId) {
      return res.status(400).json({ error: "text and userId are required" });
    }
    const user = await Account.findById(userId);
    if (!user) return res.status(404).json({ error: "user not found" });

    const post = await Post.create({
      text,
      location: location || "",
      user: user._id,
      postedAt: postedAt ? new Date(postedAt) : undefined,
    });

    return res.status(201).json({ id: post._id });
  } catch (_error) {
    return res.status(500).json({ error: "failed to create post" });
  }
});

// List posts (most recent first)
router.get("/", async (_req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "username email")
      .sort({ postedAt: -1 })
      .limit(100);

    return res.json(
      posts.map((p) => ({
        id: p._id,
        text: p.text,
        location: p.location,
        postedAt: p.postedAt,
        user: p.user,
        likes: p.likes,
      }))
    );
  } catch (_error) {
    return res.status(500).json({ error: "failed to list posts" });
  }
});

// Like/unlike a post (toggle)
router.post("/:id/like", async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "userId is required" });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "post not found" });

    const alreadyLiked = post.likes.some((id) => String(id) === String(userId));
    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => String(id) !== String(userId));
    } else {
      post.likes.push(userId);
    }
    await post.save();

    return res.status(200).json({ likesCount: post.likes.length });
  } catch (_error) {
    return res.status(500).json({ error: "failed to toggle like" });
  }
});

export default router;


