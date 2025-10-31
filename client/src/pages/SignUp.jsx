import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("http://localhost:3001/api/accounts/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Sign up failed");
        return;
      }

      localStorage.setItem("userId", data.id);
      setSuccess(true);
      setTimeout(() => navigate("/home"), 1500);
    } catch (err) {
      setError("Network error");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-12">
          <h1 className="text-5xl font-light tracking-tight text-white mb-3">Sign Up</h1>
          <p className="text-neutral-400 text-sm">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-5 py-4 bg-neutral-800 border border-neutral-700 rounded-2xl text-white placeholder:text-neutral-400 hover:border-neutral-600 focus:outline-none focus:border-white transition-all duration-200"
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-5 py-4 bg-neutral-800 border border-neutral-700 rounded-2xl text-white placeholder:text-neutral-400 hover:border-neutral-600 focus:outline-none focus:border-white transition-all duration-200"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-5 py-4 bg-neutral-800 border border-neutral-700 rounded-2xl text-white placeholder:text-neutral-400 hover:border-neutral-600 focus:outline-none focus:border-white transition-all duration-200"
            />
          </div>
          {error && (
            <div className="text-red-400 text-sm bg-red-950/20 border border-red-900/30 px-4 py-3 rounded-2xl">
              {error}
            </div>
          )}
          {success && (
            <div className="text-green-400 text-sm bg-green-950/20 border border-green-900/30 px-4 py-3 rounded-2xl">
              Account created! Redirecting...
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-white text-black font-medium py-4 rounded-2xl hover:bg-neutral-100 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-md"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}


