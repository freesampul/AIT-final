import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true, maxlength: 500 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true },
    createdAt: { type: Date, default: () => new Date() },
  },
  { _id: true }
);

const PostSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true, maxlength: 1000 },
    location: { type: String, trim: true, default: "" },
    latitude: { type: Number },
    longitude: { type: Number },
    postedAt: { type: Date, required: true, default: () => new Date() },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Account" }],
    comments: [CommentSchema],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", PostSchema);
export default Post;


