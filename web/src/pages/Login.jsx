import { useState } from "react";
import { useAuth } from "../authContext";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function onSubmit(e){ e.preventDefault(); setErr("");
    try { await login(email, password); } catch(e){ setErr("Invalid email or password"); }
  }

  return (
    <div className="max-w-md mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Log in</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border rounded p-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" className="w-full border rounded p-2" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        {err && <p className="text-red-600 text-sm">{err}</p>}
        <button className="px-4 py-2 rounded bg-black text-white">Sign in</button>
      </form>
    </div>
  );
}
