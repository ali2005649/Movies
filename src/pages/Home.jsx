import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import MovieCard from "../components/MovieCard";
import MovieFilters from "../components/MovieFilters";
import { MovieGridSkeleton, MovieCardSkeleton } from "../components/Skeleton";
import { gridVariants } from "../components/motionVariants";
import { useMovieOverlay } from "../context/MovieOverlayContext";
import { useInfiniteMovies } from "../hooks/useInfiniteMovies";
import { fetchMovieGenres } from "../lib/tmdb";

export default function Home() {
  const overlay = useMovieOverlay();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const genre = searchParams.get("genre") || "";
  const year = searchParams.get("year") || "";
  const minRating = searchParams.get("rating") || "";

  const [genres, setGenres] = useState([]);
  const sentinelRef = useRef(null);

  const { movies, loading, loadingMore, error, hasMore, loadMore } =
    useInfiniteMovies({ query, genre, year, minRating });

  useEffect(() => {
    fetchMovieGenres()
      .then((data) => setGenres(data.genres || []))
      .catch(() => setGenres([]));
  }, []);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: "240px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [loadMore, loading, hasMore]);

  const updateFilters = (patch) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(patch).forEach(([key, value]) => {
      const paramKey = key === "minRating" ? "rating" : key;
      if (value) next.set(paramKey, value);
      else next.delete(paramKey);
    });
    setSearchParams(next, { replace: true });
  };

  const title = query.trim() ? `Results for “${query.trim()}”` : "Discover Movies";

  return (
    <div
      className={`canvas-page p-6 md:p-8 ${overlay ? "pointer-events-none" : ""}`}
      aria-hidden={overlay}
      inert={overlay || undefined}
    >
      <div className="max-w-7xl mx-auto mb-8 space-y-4">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="page-results-heading font-sans text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-text-main"
        >
          {title}
        </motion.h1>
        <MovieFilters
          genres={genres}
          genre={genre}
          year={year}
          minRating={minRating}
          onChange={updateFilters}
        />
      </div>

      <div className="max-w-7xl mx-auto">
        {loading ? (
          <MovieGridSkeleton />
        ) : error && movies.length === 0 ? (
          <div className="text-red-500 text-xl text-center mt-20">{error}</div>
        ) : movies.length === 0 ? (
          <div className="text-text-muted text-xl text-center mt-20">
            No movies found. Try adjusting search or filters.
          </div>
        ) : (
          <>
            <motion.div
              variants={gridVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
            >
              {movies.map((movie) => (
                <MovieCard key={`${movie.id}-${movie.release_date || ""}`} movie={movie} />
              ))}
            </motion.div>

            {loadingMore && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <MovieCardSkeleton key={`more-${i}`} />
                ))}
              </div>
            )}

            <div ref={sentinelRef} className="h-10 mt-8" aria-hidden="true" />

            {!hasMore && (
              <p className="text-center text-text-muted text-sm pb-8">
                You’ve reached the end.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
