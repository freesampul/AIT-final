import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("http://localhost:3001/api/accounts/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Sign in failed");
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
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent mb-4">
            Sign In
          </h1>
          <p className="text-neutral-400">Welcome back</p>
        </div>

        <div className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800/50 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                type="text"
                placeholder="Username or Email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="w-full px-6 py-4 bg-neutral-800/50 border border-neutral-700/50 rounded-2xl text-white placeholder:text-neutral-500 hover:border-neutral-600 focus:outline-none focus:border-white/50 focus:bg-neutral-800/70 transition-all duration-300"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-6 py-4 bg-neutral-800/50 border border-neutral-700/50 rounded-2xl text-white placeholder:text-neutral-500 hover:border-neutral-600 focus:outline-none focus:border-white/50 focus:bg-neutral-800/70 transition-all duration-300"
              />
            </div>
            {error && (
              <div className="text-red-400 text-sm bg-red-950/30 border border-red-900/50 px-4 py-3 rounded-xl backdrop-blur-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="text-green-400 text-sm bg-green-950/30 border border-green-900/50 px-4 py-3 rounded-xl backdrop-blur-sm">
                Signed in successfully!
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-white to-neutral-200 text-black font-semibold py-4 rounded-2xl hover:from-neutral-100 hover:to-neutral-300 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}


