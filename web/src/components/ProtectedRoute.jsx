import { Navigate } from "react-router-dom";
import { useAuth } from "../authContext";

export default function ProtectedRoute({ roles = [], children }) {
  const { user, loaded } = useAuth();
  if (!loaded) return null;               // wait for /auth/me
  if (!user) return <Navigate to="/login" replace />;
  if (roles.length && !user.roles?.some(r => roles.includes(r.name))) {
    return <Navigate to="/" replace />;
  }
  return children;
}
