import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import BottomNav from "@/components/BottomNav";
import { getMemories } from "@/lib/store";

export default function Memories() {
  const navigate = useNavigate();
  const [memories] = useState(getMemories);

  return (
    <>
      <PageWrapper>
        <h1 className="text-xl font-bold mb-4">我们的回忆 💕</h1>

        <button
          onClick={() => navigate("/add-memory")}
          className="w-full bg-secondary text-secondary-foreground py-3 rounded-2xl font-medium mb-4 transition-all hover:bg-love-blush"
        >
          + 添加一段回忆
        </button>

        {memories.length === 0 && (
          <div className="text-center text-muted-foreground mt-12">
            <p className="text-4xl mb-3">🌱</p>
            <p className="text-sm">还没有回忆呢，去约会吧！</p>
          </div>
        )}

        <div className="space-y-3">
          {memories.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="love-card"
            >
              <p className="text-xs text-muted-foreground mb-1">📅 {m.date}</p>
              <p className="font-semibold text-sm">
                {m.emoji} {m.activity}
              </p>
              {m.note && (
                <p className="text-xs text-muted-foreground mt-1 italic">
                  "{m.note}"
                </p>
              )}
              {m.photo && (
                <img
                  src={m.photo}
                  alt="回忆照片"
                  className="mt-2 rounded-xl w-full max-h-40 object-cover"
                />
              )}
            </motion.div>
          ))}
        </div>
      </PageWrapper>
      <BottomNav />
    </>
  );
}
