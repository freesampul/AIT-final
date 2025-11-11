import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Map from "../components/Map.jsx";

export default function Home() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [postText, setPostText] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
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

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    setGettingLocation(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([longitude, latitude]);
        setLatitude(latitude);
        setLongitude(longitude);
        setGettingLocation(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        setLocationError("Unable to get your location");
        setGettingLocation(false);
      }
    );
  };

  const handleLocationSelect = ({ latitude, longitude }) => {
    setLatitude(latitude);
    setLongitude(longitude);
    setLocationError("");
  };

  const clearLocation = () => {
    setLatitude(null);
    setLongitude(null);
    setLocation("");
  };

  useEffect(() => {
    // Check if user is signed in (stored in localStorage or check token)
    const storedUser = localStorage.getItem("userId");
    if (storedUser) {
      setIsSignedIn(true);
      setUserId(storedUser);
      fetchFeed();
      getCurrentLocation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setLoading(true);

    const postData = {
      text: postText,
      location: location || "",
      latitude: latitude,
      longitude: longitude,
      userId: userId,
    };

    console.log("Creating post with data:", postData);

    try {
      const res = await fetch("http://localhost:3001/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      if (res.ok) {
        setPostText("");
        setLocation("");
        setLatitude(null);
        setLongitude(null);
        fetchFeed();
      }
    } catch (err) {
      console.error("Failed to create post:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    if (!userId) return;

    // Optimistically update UI
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post._id === postId || post.id === postId) {
          const wasLiked = post.likes?.some((id) => String(id) === String(userId));
          const newLikes = wasLiked
            ? post.likes.filter((id) => String(id) !== String(userId))
            : [...(post.likes || []), userId];
          return { ...post, likes: newLikes };
        }
        return post;
      })
    );

    try {
      const res = await fetch(`http://localhost:3001/api/posts/${postId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!res.ok) {
        // Revert on error
        fetchFeed();
      }
    } catch (err) {
      console.error("Failed to like post:", err);
      // Revert on error
      fetchFeed();
    }
  };

  const isLiked = (post) => {
    if (!post.likes || !userId) return false;
    return post.likes.some((id) => String(id) === String(userId));
  };

  if (!isSignedIn) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center space-y-6">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent mb-4">
            AIT Social
          </h1>
          <p className="text-neutral-400 text-xl">Sign in to start sharing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Create Post Form */}
      <div className="mb-8 bg-neutral-900/50 backdrop-blur-sm border border-neutral-800/50 rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/20 to-neutral-600/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">Create Post</h2>
        </div>
        <form onSubmit={handleCreatePost} className="space-y-4">
          <div>
            <textarea
              placeholder="What's happening?"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              required
              rows={3}
              className="w-full px-6 py-4 bg-neutral-800/50 border border-neutral-700/50 rounded-2xl text-white placeholder:text-neutral-500 hover:border-neutral-600 focus:outline-none focus:border-white/50 focus:bg-neutral-800/70 transition-all duration-300 resize-none"
            />
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                {latitude && longitude ? (
                  <div className="px-4 py-3 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-green-400 text-sm font-medium">
                        Location set ({latitude.toFixed(4)}, {longitude.toFixed(4)})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={clearLocation}
                      className="text-green-400 hover:text-green-300 text-xs px-2 py-1 rounded"
                    >
                      Clear
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={getCurrentLocation}
                      disabled={gettingLocation}
                      className="px-4 py-3 bg-neutral-800/50 border border-neutral-700/50 rounded-xl text-neutral-300 hover:bg-neutral-800/70 hover:border-neutral-600 transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
                    >
                      {gettingLocation ? (
                        <>
                          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span className="text-xs">Getting location...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-xs">Use my location</span>
                        </>
                      )}
                    </button>
                    <div className="flex-1 px-4 py-3 bg-neutral-800/30 border border-neutral-700/30 rounded-xl text-neutral-500 text-xs flex items-center justify-center">
                      Or click on the map to set location
                    </div>
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-8 bg-gradient-to-r from-white to-neutral-200 text-black font-semibold py-3 rounded-xl hover:from-neutral-100 hover:to-neutral-300 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {loading ? "Posting..." : "Post"}
              </button>
            </div>
            {locationError && (
              <p className="text-red-400 text-xs">{locationError}</p>
            )}
          </div>
        </form>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Feed Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-3xl font-bold text-white">Feed</h2>
            <span className="text-neutral-500 text-sm">({posts.length})</span>
          </div>
          {posts.length === 0 ? (
            <div className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800/50 rounded-3xl p-16 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-800/50 flex items-center justify-center">
                <svg className="w-8 h-8 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-neutral-400 text-lg">No posts yet. Be the first to share!</p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post._id} className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800/50 rounded-3xl p-6 shadow-xl hover:shadow-2xl hover:border-neutral-700/50 transition-all duration-300">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/20 to-neutral-600/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold text-sm">
                      {post.user?.username?.charAt(0).toUpperCase() || "?"}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {post.user && (
                        <span className="font-semibold text-neutral-300">{post.user.username}</span>
                      )}
                      <span className="text-neutral-600">•</span>
                      <span className="text-neutral-500 text-sm">{new Date(post.postedAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-white text-base leading-relaxed mb-3">{post.text}</p>
                    {post.location && (
                      <p className="text-neutral-400 text-sm mb-3 flex items-center gap-2">
                        <span>📍</span>
                        {post.location}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-neutral-800/50">
                  <button
                    onClick={() => handleLike(post._id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                      isLiked(post)
                        ? "bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30"
                        : "bg-neutral-800/50 text-neutral-400 hover:bg-neutral-800/70 hover:text-white border border-neutral-700/50"
                    }`}
                  >
                    <svg
                      className={`w-5 h-5 ${isLiked(post) ? "fill-red-400" : "fill-none"}`}
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    <span className="text-sm font-medium">
                      {post.likes?.length || 0}
                    </span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Map Section */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-2xl font-bold text-white">Map</h2>
            </div>
            <div className="h-[600px]">
              <Map 
                posts={posts} 
                onLocationSelect={handleLocationSelect}
                userLocation={userLocation}
              />
            </div>
            <div className="mt-3 text-center">
              <p className="text-neutral-500 text-xs">
                {posts.filter(p => p.latitude && p.longitude).length} {posts.filter(p => p.latitude && p.longitude).length === 1 ? 'post' : 'posts'} with locations
              </p>
              {posts.filter(p => p.latitude && p.longitude).length === 0 && (
                <p className="text-neutral-600 text-xs mt-1">
                  Create a post with location to see it on the map
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


