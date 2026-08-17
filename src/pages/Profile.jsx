import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FaHeart, FaUserCircle } from "react-icons/fa";
import { ProfileSkeleton } from "../components/Skeleton";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      setLoading(true);
      const [favRes, revRes] = await Promise.all([
        supabase
          .from("favorites")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id),
        supabase
          .from("reviews")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id),
      ]);

      if (favRes.error) toast.error("Could not load favorites count");
      setFavoritesCount(favRes.count || 0);
      setReviewsCount(revRes.error ? 0 : revRes.count || 0);
      setLoading(false);
    };

    load();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Logout failed");
    }
  };

  if (loading) {
    return (
      <div className="canvas-page">
        <ProfileSkeleton />
      </div>
    );
  }

  const joined = user?.created_at
    ? new Date(user.created_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  return (
    <div className="canvas-page p-6 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-text-main"
        >
          Profile
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface border border-text-muted/15 rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row gap-6 items-start"
        >
          <FaUserCircle className="text-6xl text-primary shrink-0" />
          <div className="space-y-2 min-w-0">
            <p className="text-xl font-bold text-text-main break-all">
              {user?.email}
            </p>
            <p className="text-text-muted text-sm">Member since {joined}</p>
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-surface border border-text-muted/15 rounded-2xl p-5">
            <p className="text-text-muted text-sm mb-1">Cloud favorites</p>
            <p className="text-3xl font-bold text-primary">{favoritesCount}</p>
          </div>
          <div className="bg-surface border border-text-muted/15 rounded-2xl p-5">
            <p className="text-text-muted text-sm mb-1">Reviews written</p>
            <p className="text-3xl font-bold text-primary">{reviewsCount}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/favorites"
            className="inline-flex items-center gap-2 bg-primary text-slate-900 font-bold px-5 py-3 rounded-xl"
          >
            <FaHeart /> View favorites
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500 px-5 py-3 rounded-xl font-bold transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
