import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";

export default function SaveSuccess() {
  const navigate = useNavigate();

  return (
    <PageWrapper className="flex flex-col items-center justify-center text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 15 }}
      >
        <span className="text-6xl block mb-4">💕</span>
        <h2 className="text-xl font-bold mb-2">已加入回忆</h2>
        <p className="text-sm text-muted-foreground italic mb-8">
          "以后回头看会很甜的" ✨
        </p>

        <div className="space-y-3 w-56">
          <button
            onClick={() => navigate("/memories")}
            className="w-full bg-primary text-primary-foreground py-3 rounded-2xl font-semibold shadow-soft"
          >
            去看看回忆
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-secondary text-secondary-foreground py-3 rounded-2xl font-medium"
          >
            继续逛逛
          </button>
        </div>
      </motion.div>
    </PageWrapper>
  );
}
