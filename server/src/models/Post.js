import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true, maxlength: 1000 },
    location: { type: String, trim: true, default: "" },
    postedAt: { type: Date, required: true, default: () => new Date() },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Account" }],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", PostSchema);
export default Post;


