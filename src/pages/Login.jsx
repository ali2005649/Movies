import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FaArrowLeft, FaEnvelope } from "react-icons/fa";
import { supabase } from "../lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);

    const trimmedEmail = email.trim();

    try {
      console.info("[auth] signInWithOtp start", {
        emailDomain: trimmedEmail.split("@")[1] || "(none)",
        supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
        hasAnonKey: Boolean(import.meta.env.VITE_SUPABASE_ANON_KEY),
        keyPrefix: String(import.meta.env.VITE_SUPABASE_ANON_KEY || "").slice(0, 18),
      });

      const { data, error } = await supabase.auth.signInWithOtp({
        email: trimmedEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          shouldCreateUser: true,
        },
      });

      if (error) {
        console.error("[auth] signInWithOtp supabase error", error);
        throw error;
      }

      console.info("[auth] signInWithOtp success", data);
      toast.success("Magic link sent! Check your inbox.");
    } catch (error) {
      console.error("[auth] signInWithOtp failed", error);
      console.error("[auth] signInWithOtp failure details", {
        name: error?.name,
        message: error?.message,
        status: error?.status,
        code: error?.code,
        cause: error?.cause,
        stack: error?.stack,
      });
      toast.error(error?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="canvas-page flex min-h-[calc(100dvh-4.5rem)] flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md p-8 bg-surface rounded-2xl shadow-2xl border border-text-muted/10"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-text-muted hover:text-primary mb-6 transition-colors"
        >
          <FaArrowLeft /> Back to home
        </Link>

        <h1 className="text-3xl font-bold text-text-main mb-2">Sign in</h1>
        <p className="text-text-muted mb-8">
          Enter your email for a passwordless magic link.
        </p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-background text-text-main pl-10 pr-4 py-3 rounded-xl border border-text-muted/20 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="w-full bg-primary hover:brightness-110 text-slate-900 font-bold py-3 rounded-xl transition-all disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send magic link"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
