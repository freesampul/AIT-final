import { Router } from "express";
import Post from "../models/Post.js";
import Account from "../models/Account.js";

const router = Router();

// Create post
router.post("/", async (req, res) => {
  try {
    const { text, location, latitude, longitude, userId, postedAt } = req.body;
    if (!text || !userId) {
      return res.status(400).json({ error: "text and userId are required" });
    }
    const user = await Account.findById(userId);
    if (!user) return res.status(404).json({ error: "user not found" });

    // Parse coordinates if provided
    let lat = null;
    let lng = null;
    
    // Check if latitude and longitude are provided and valid
    if (latitude !== null && latitude !== undefined && latitude !== "" && !isNaN(Number(latitude))) {
      lat = Number(latitude);
      if (isNaN(lat) || lat < -90 || lat > 90) {
        console.log("Invalid latitude:", latitude);
        lat = null;
      }
    }
    
    if (longitude !== null && longitude !== undefined && longitude !== "" && !isNaN(Number(longitude))) {
      lng = Number(longitude);
      if (isNaN(lng) || lng < -180 || lng > 180) {
        console.log("Invalid longitude:", longitude);
        lng = null;
      }
    }

    console.log("Creating post - received:", { latitude, longitude, location, text: text?.substring(0, 50) });
    console.log("Creating post - parsed coords:", { lat, lng });

    const postData = {
      text,
      location: location || "",
      user: user._id,
    };

    // Add coordinates if both are valid numbers
    if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng)) {
      postData.latitude = lat;
      postData.longitude = lng;
      console.log("✓ Adding coordinates to post:", { latitude: lat, longitude: lng });
    } else {
      console.log("✗ No valid coordinates - lat:", lat, "lng:", lng);
    }

    if (postedAt) {
      postData.postedAt = new Date(postedAt);
    }

    const post = await Post.create(postData);
    console.log("Post created:", { id: post._id, hasLat: !!post.latitude, hasLng: !!post.longitude });

    return res.status(201).json({ id: post._id });
  } catch (error) {
    console.error("Error creating post:", error);
    return res.status(500).json({ error: "failed to create post" });
  }
});

// List posts (most recent first)
router.get("/", async (_req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "username email")
      .populate("comments.user", "username email")
      .sort({ postedAt: -1 })
      .limit(100);

    return res.json(
      posts.map((p) => {
        const postObj = {
          id: p._id,
          _id: p._id,
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
        
        // Include coordinates if they exist
        if (p.latitude != null && p.longitude != null) {
          postObj.latitude = p.latitude;
          postObj.longitude = p.longitude;
        }
        
        return postObj;
      })
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

// Add comment to a post
router.post("/:id/comments", async (req, res) => {
  try {
    const { text, userId } = req.body;
    if (!text || !userId) {
      return res.status(400).json({ error: "text and userId are required" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "post not found" });

    const user = await Account.findById(userId);
    if (!user) return res.status(404).json({ error: "user not found" });

    post.comments.push({
      text: text.trim(),
      user: user._id,
      createdAt: new Date(),
    });

    await post.save();

    // Populate the comment's user before returning
    await post.populate("comments.user", "username email");

    const newComment = post.comments[post.comments.length - 1];
    return res.status(201).json({
      comment: {
        _id: newComment._id,
        text: newComment.text,
        user: newComment.user,
        createdAt: newComment.createdAt,
      },
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    return res.status(500).json({ error: "failed to add comment" });
  }
});

export default router;


