import React from "react";
import { motion, AnimatePresence } from "motion/react";

interface NotificationProps {
  message: string | null;
}

export const Notification: React.FC<NotificationProps> = ({ message }) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: 20, x: "-50%" }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-[#E4E3E0] text-[#141414] text-[10px] font-mono font-bold uppercase tracking-[0.2em] border border-[#141414]/20 shadow-2xl z-50 pointer-events-none"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
