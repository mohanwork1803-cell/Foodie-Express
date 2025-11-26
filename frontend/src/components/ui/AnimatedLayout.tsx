import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

export default function AnimatedLayout() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: -10 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="w-full h-full"
    >
      <Outlet />
    </motion.div>
  );
}
