import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../services/api";
import { useChatStore } from "../store/chatStore";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const setAuth = useChatStore((s) => s.setAuth);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/api/auth/signup", { fullName, email, password });
      const token = res.data?.token || res.data?.accessToken || "chat-cookie-auth";
      const user = res.data?.user || {
        id: res.data?._id,
        fullName: res.data?.fullName || fullName,
        email: res.data?.email || email,
        profilePic: res.data?.profilePic,
      };
      setAuth({ token, user });
      navigate("/chat", { replace: true });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 dark:bg-slate-950 px-4 transition-colors">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="mb-1 text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">ConnectChat</p>
        <h1 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-white">Create account</h1>

        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Full name
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 transition-colors outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-indigo-500"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 transition-colors outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-indigo-500"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Password
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 transition-colors outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-indigo-500"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-700 dark:disabled:text-slate-500"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
