import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [postText, setPostText] = useState("");
  const [location, setLocation] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchFeed = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/feed");
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (err) {
      console.error("Failed to fetch feed:", err);
    }
  };

  useEffect(() => {
    // Check if user is signed in (stored in localStorage or check token)
    const storedUser = localStorage.getItem("userId");
    if (storedUser) {
      setIsSignedIn(true);
      setUserId(storedUser);
      fetchFeed();
    }
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: postText,
          location: location || "",
          userId: userId,
        }),
      });

      if (res.ok) {
        setPostText("");
        setLocation("");
        fetchFeed();
      }
    } catch (err) {
      console.error("Failed to create post:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isSignedIn) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-8">AIT Social</h1>
          <p className="text-neutral-400 text-lg">Sign in to use</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-8">AIT Social</h1>

      {/* Create Post Form */}
      <form onSubmit={handleCreatePost} className="mb-12 space-y-4">
        <div>
          <input
            type="text"
            placeholder="What's happening?"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            required
            className="w-full px-5 py-4 bg-neutral-800 border border-neutral-700 rounded-2xl text-white placeholder:text-neutral-400 hover:border-neutral-600 focus:outline-none focus:border-white transition-all duration-200"
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Location (optional)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-5 py-4 bg-neutral-800 border border-neutral-700 rounded-2xl text-white placeholder:text-neutral-400 hover:border-neutral-600 focus:outline-none focus:border-white transition-all duration-200"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-black font-medium py-4 rounded-2xl hover:bg-neutral-100 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-md disabled:opacity-50"
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </form>

      {/* Feed */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post._id} className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6">
            <p className="text-white mb-2">{post.text}</p>
            {post.location && <p className="text-neutral-400 text-sm">📍 {post.location}</p>}
            {post.user && (
              <p className="text-neutral-500 text-xs mt-2">
                by {post.user.username} • {new Date(post.postedAt).toLocaleDateString()}
              </p>
            )}
            <p className="text-neutral-500 text-xs mt-1">
              {post.likes?.length || 0} likes
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}


