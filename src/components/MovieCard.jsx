import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import SharedPoster from "./SharedPoster";
import { usePosterAura } from "../hooks/usePosterAura";
import { movieLocationState } from "../lib/movieNav";
import { posterUrl } from "../lib/tmdb";
import { cardVariants } from "./motionVariants";

export default function MovieCard({ movie }) {
  const location = useLocation();
  const image = posterUrl(movie.poster_path);
  const { imgRef, activate, deactivate, warm } = usePosterAura();

  const lightUp = (node) => {
    activate(movie.id, image, node);
  };

  return (
    <motion.div
      variants={cardVariants}
      className="h-full"
      onPointerEnter={(e) => lightUp(e.currentTarget)}
      onPointerLeave={deactivate}
    >
      <Link
        to={`/movie/${movie.id}`}
        state={movieLocationState(movie, location)}
        className="relative z-[1] block h-full bg-surface text-text-main rounded-xl shadow-lg hover:shadow-2xl hover:shadow-primary/10 flex flex-col border border-text-muted/10 transition-shadow duration-100"
        onFocus={(e) => lightUp(e.currentTarget)}
        onBlur={deactivate}
      >
        <div data-cursor="explore" className="relative pointer-events-auto">
          <SharedPoster
            id={movie.id}
            src={image}
            alt={movie.title}
            imgRef={imgRef}
            className="w-full aspect-[2/3] object-cover pointer-events-none"
            onLoad={() => warm(image, movie.id)}
          />
        </div>
        <div className="p-4 flex flex-col gap-2 flex-grow justify-between">
          <h2 className="font-bold text-lg line-clamp-1" title={movie.title}>
            {movie.title}
          </h2>
          <div className="flex items-center gap-2 text-primary font-bold">
            <FaStar />
            <span>
              {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
