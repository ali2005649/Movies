import { motion } from "framer-motion";
import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { isLight, toggleTheme } = useTheme();

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      onClick={toggleTheme}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-background/70 text-primary border border-text-muted/20 hover:border-primary/45 hover:bg-background transition-colors duration-200"
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      title={isLight ? "Dark mode" : "Light mode"}
    >
      {isLight ? <FaMoon className="text-sm" /> : <FaSun className="text-sm" />}
    </motion.button>
  );
}
