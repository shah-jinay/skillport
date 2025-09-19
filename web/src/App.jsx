// web/src/App.jsx
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import JobsPage from "./pages/JobsPage";

export default function App() {
  return (
    <>
      {/* Simple top nav (optional) */}
      <nav className="p-4 border-b">
        <div className="max-w-6xl mx-auto flex gap-6">
          <Link to="/">SkillPort</Link>
          <Link to="/jobs">Jobs</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<JobsPage />} />
      </Routes>
    </>
  );
}
