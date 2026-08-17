import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="canvas-page flex min-h-[calc(100dvh-4.5rem)] flex-col items-center justify-center p-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md space-y-4"
      >
        <p className="text-primary text-7xl font-black">404</p>
        <h1 className="text-3xl font-bold text-text-main">Page not found</h1>
        <p className="text-text-muted">
          The page you’re looking for doesn’t exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block mt-4 bg-primary text-slate-900 font-bold px-6 py-3 rounded-xl hover:brightness-110 transition-all"
        >
          Back to home
        </Link>
      </motion.div>
    </div>
  );
}
