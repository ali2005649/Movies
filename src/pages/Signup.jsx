import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FaArrowLeft, FaEnvelope, FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

const fieldClass =
  "w-full bg-background text-text-main pl-10 pr-4 py-3 rounded-xl border border-text-muted/20 focus:outline-none focus:ring-2 focus:ring-primary transition-all";

export default function Signup() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  if (!authLoading && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSignup = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setError("");
    setInfo("");

    if (password !== confirmPassword) {
      const message = "Passwords do not match.";
      setError(message);
      toast.error(message);
      return;
    }

    if (password.length < 6) {
      const message = "Password must be at least 6 characters.";
      setError(message);
      toast.error(message);
      return;
    }

    setLoading(true);
    const trimmedEmail = email.trim();

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            email: trimmedEmail,
          },
        },
      });

      if (signUpError) throw signUpError;

      const alreadyRegistered =
        data.user?.identities && data.user.identities.length === 0;
      if (alreadyRegistered) {
        throw new Error("An account with this email already exists. Please sign in.");
      }

      if (data.session?.user) {
        toast.success("Account created. Welcome!");
        navigate("/", { replace: true });
        return;
      }

      const message =
        "Account created. Check your inbox to confirm your email, then sign in.";
      setInfo(message);
      toast.success(message);
    } catch (err) {
      const message = err?.message || "Sign up failed";
      setError(message);
      toast.error(message);
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

        <h1 className="text-3xl font-bold text-text-main mb-2">Create account</h1>
        <p className="text-text-muted mb-8">
          Sign up with your email and a password.
        </p>

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          {error ? (
            <p
              role="alert"
              className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400"
            >
              {error}
            </p>
          ) : null}

          {info ? (
            <p
              role="status"
              className="rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-primary"
            >
              {info}
            </p>
          ) : null}

          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={fieldClass}
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="new-password"
              placeholder="Password (min. 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className={`${fieldClass} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((open) => !open)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              autoComplete="new-password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className={fieldClass}
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="w-full bg-primary hover:brightness-110 text-slate-900 font-bold py-3 rounded-xl transition-all disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Sign up"}
          </motion.button>
        </form>

        <p className="mt-6 text-center text-sm text-text-muted">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
