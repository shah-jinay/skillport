import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Layout } from "../components/Layout";
import { useAuth } from "../authContext";

export default function Register() {
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setErr(""); setLoading(true);
    try {
      await register(email, password);
      navigate("/jobs");
    } catch (e) {
      setErr("Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="max-w-sm mx-auto mt-12">
        <h1 className="text-2xl font-semibold">Register</h1>
        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <input className="w-full border rounded-lg px-3 py-2" placeholder="Email"
                 value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="w-full border rounded-lg px-3 py-2" type="password" placeholder="Password"
                 value={password} onChange={e=>setPassword(e.target.value)} />
          {err && <p className="text-red-600 text-sm">{err}</p>}
          <button disabled={loading} className="w-full bg-black text-white rounded-lg py-2">
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>
        <p className="text-sm mt-3">
          Already have an account? <Link to="/login" className="text-blue-600">Login</Link>
        </p>
      </div>
    </Layout>
  );
}
