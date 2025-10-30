import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.jsx";
import SignUp from "./pages/SignUp.jsx";
import SignIn from "./pages/SignIn.jsx";
import Feed from "./pages/Feed.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <BrowserRouter>
        <nav className="border-b border-neutral-800">
          <div className="max-w-3xl mx-auto px-6 py-4 flex gap-6">
            <Link className="hover:underline" to="/">Home</Link>
            <Link className="hover:underline" to="/signup">Sign Up</Link>
            <Link className="hover:underline" to="/signin">Sign In</Link>
            <Link className="hover:underline" to="/feed">Home Feed</Link>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/feed" element={<Feed />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}
