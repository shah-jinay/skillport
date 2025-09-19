import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import JobsPage from "./pages/JobsPage";
import PostJob from "./pages/PostJob";
import Login from "./pages/Login";
import Register from "./pages/Register";
import JobDetail from "./pages/JobDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./authContext";

function TopNav() {
  const { user, logout } = useAuth();
  return (
    <nav className="p-4 border-b">
      <div className="max-w-6xl mx-auto flex gap-6 items-center">
        <Link to="/" className="font-semibold">SkillPort</Link>
        <Link to="/jobs">Jobs</Link>
        <div className="ml-auto flex gap-4 items-center">
          {user ? (
            <>
              <span className="text-sm text-gray-600">{user.email}</span>
              {(user.roles||[]).some(r => ["recruiter","admin"].includes(r.name)) && (
                <Link to="/post" className="px-3 py-1 rounded bg-black text-white">Post a Job</Link>
              )}
              <button onClick={logout} className="text-sm underline">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="underline">Login</Link>
              <Link to="/register" className="underline">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <>
      <TopNav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/post"
          element={
            <ProtectedRoute roles={["recruiter","admin"]}>
              <PostJob />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
