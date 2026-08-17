import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FaHeartBroken } from "react-icons/fa";
import MovieCard from "../components/MovieCard";
import { MovieGridSkeleton } from "../components/Skeleton";
import { useAuth } from "../context/AuthContext";
import { useMovieOverlay } from "../context/MovieOverlayContext";
import { supabase } from "../lib/supabase";

const gridVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

export default function Favorites() {
  const overlay = useMovieOverlay();
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchFavorites = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Could not load favorites");
        setFavorites([]);
      } else {
        setFavorites(data || []);
      }
      setLoading(false);
    };

    fetchFavorites();
  }, [user]);

  if (loading) {
    return (
      <div className="canvas-page p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-text-main mb-8">My Favorites</h1>
          <MovieGridSkeleton count={5} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`canvas-page p-8 ${overlay ? "pointer-events-none" : ""}`}
      aria-hidden={overlay}
      inert={overlay || undefined}
    >
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-text-main mb-8"
        >
          My Favorites
        </motion.h1>

        {favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-text-muted mt-20 gap-4"
          >
            <FaHeartBroken className="text-6xl text-text-muted/40" />
            <p className="text-2xl">Your favorites list is empty.</p>
            <Link to="/" className="text-primary hover:underline mt-2">
              Go back to add some movies!
            </Link>
          </motion.div>
        ) : (
          <motion.div
            variants={gridVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
          >
            {favorites.map((fav, index) => (
              <MovieCard
                key={fav.id}
                movie={{
                  id: fav.movie_id,
                  title: fav.movie_title,
                  poster_path: fav.movie_poster,
                  vote_average: fav.vote_average,
                }}
                priority={index < 8}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
