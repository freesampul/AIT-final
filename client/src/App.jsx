import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.jsx";
import SignUp from "./pages/SignUp.jsx";
import SignIn from "./pages/SignIn.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white">
      <BrowserRouter>
        <nav className="border-b border-neutral-800/50 backdrop-blur-sm bg-neutral-900/30 sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-6 py-4 flex gap-8 items-center">
            <Link className="text-xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent" to="/home">
              AIT Social
            </Link>
            <div className="flex gap-6 ml-auto">
              <Link className="text-neutral-300 hover:text-white transition-colors duration-200 font-medium" to="/home">Home</Link>
              <Link className="text-neutral-300 hover:text-white transition-colors duration-200 font-medium" to="/signup">Sign Up</Link>
              <Link className="text-neutral-300 hover:text-white transition-colors duration-200 font-medium" to="/signin">Sign In</Link>
            </div>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}
