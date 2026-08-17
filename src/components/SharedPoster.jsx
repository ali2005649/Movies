import { motion } from "framer-motion";
import { posterLayoutId } from "../lib/movieNav";
import { posterSpring } from "./motionVariants";

export default function SharedPoster({
  id,
  src,
  alt,
  className = "",
  imgRef,
  onLoad,
}) {
  if (!src) {
    return (
      <div
        className={`flex aspect-[2/3] items-center justify-center bg-background text-text-muted ${className}`}
      >
        No Image
      </div>
    );
  }

  return (
    <motion.img
      ref={imgRef}
      layoutId={posterLayoutId(id)}
      src={src}
      alt={alt}
      className={`shared-poster ${className}`}
      style={{ borderRadius: 16 }}
      transition={posterSpring}
      draggable={false}
      onLoad={onLoad}
    />
  );
}
