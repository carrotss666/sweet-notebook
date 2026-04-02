import { motion } from "framer-motion";
import { ReactNode } from "react";

export default function PageWrapper({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`min-h-screen pb-20 px-5 pt-6 max-w-md mx-auto ${className}`}
    >
      {children}
    </motion.div>
  );
}
