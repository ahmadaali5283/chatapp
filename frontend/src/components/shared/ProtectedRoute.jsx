import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import api from "../../services/api";
import { useChatStore } from "../../store/chatStore";

export default function ProtectedRoute() {
  const currentUser = useChatStore((s) => s.currentUser);
  const token = useChatStore((s) => s.token);
  const setAuth = useChatStore((s) => s.setAuth);
  const clearAuth = useChatStore((s) => s.clearAuth);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;

    const restore = async () => {
      try {
        if (currentUser) {
          return;
        }

        const res = await api.get("/api/auth/check");
        const user = res.data?.user;
        if (user && mounted) {
          setAuth({ token: token || "chat-cookie-auth", user });
        }
      } catch (error) {
        if (mounted && !currentUser) {
          clearAuth();
        }
      } finally {
        if (mounted) {
          setChecking(false);
        }
      }
    };

    restore();

    return () => {
      mounted = false;
    };
  }, [clearAuth, currentUser, setAuth, token]);

  if (checking) {
    return <div className="grid min-h-screen place-items-center bg-slate-950 text-slate-300">Loading...</div>;
  }

  return token || currentUser ? <Outlet /> : <Navigate to="/login" replace />;
}
