import { useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { posterLayoutId } from "../lib/movieNav";
import { posterSpring } from "./motionVariants";

export function PosterPlaceholder({ title, className = "" }) {
  return (
    <div
      className={`poster-fallback ${className}`}
      role="img"
      aria-label={title ? `${title} poster unavailable` : "Poster unavailable"}
    >
      <span className="poster-fallback__glow" aria-hidden="true" />
      <span className="poster-fallback__copy">
        <span className="poster-fallback__title">{title || "Untitled"}</span>
        <span className="poster-fallback__hint">Poster unavailable</span>
      </span>
    </div>
  );
}

export default function SharedPoster({
  id,
  src,
  srcSet,
  sizes,
  alt,
  title,
  className = "",
  imgRef,
  onLoad,
  loading = "lazy",
  fetchPriority,
  width,
  height,
}) {
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const localRef = useRef(null);
  const label = alt || title || "Movie poster";
  const showImage = Boolean(src) && !failed;

  const assignRef = (node) => {
    localRef.current = node;
    if (imgRef) imgRef.current = node;
  };

  useLayoutEffect(() => {
    setFailed(false);
    const img = localRef.current;
    if (img?.complete && img.naturalWidth > 1) {
      setReady(true);
      return;
    }
    setReady(false);
  }, [src]);

  const markFailed = () => {
    setFailed(true);
    setReady(false);
  };

  const markReady = (e) => {
    const img = e.currentTarget;
    if (!img.naturalWidth || img.naturalWidth < 2) {
      markFailed();
      return;
    }
    setReady(true);
    onLoad?.(e);
  };

  return (
    <motion.div
      layoutId={posterLayoutId(id)}
      className={`shared-poster ${ready ? "is-loaded" : ""} ${className}`}
      style={{ borderRadius: 16 }}
      transition={posterSpring}
    >
      {showImage ? (
        <>
          <span className="shared-poster__skeleton skeleton-shimmer" aria-hidden="true" />
          <img
            ref={assignRef}
            src={src}
            srcSet={srcSet}
            sizes={sizes}
            alt={label}
            width={width}
            height={height}
            loading={loading}
            decoding="async"
            fetchPriority={fetchPriority}
            draggable={false}
            referrerPolicy="no-referrer"
            className={`shared-poster__img ${ready ? "is-ready" : ""}`}
            onError={markFailed}
            onLoad={markReady}
          />
        </>
      ) : (
        <PosterPlaceholder title={title || alt} className="h-full w-full" />
      )}
    </motion.div>
  );
}
