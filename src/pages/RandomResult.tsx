import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import BackButton from "@/components/BackButton";
import { getRandomActivity } from "@/lib/store";

export default function RandomResult() {
  const navigate = useNavigate();
  const [activity, setActivity] = useState(getRandomActivity);
  const [key, setKey] = useState(0);

  const reroll = () => {
    setActivity(getRandomActivity());
    setKey((k) => k + 1);
  };

  const start = () => {
    navigate("/in-progress", {
      state: { emoji: activity.emoji, title: activity.title },
    });
  };

  return (
    <PageWrapper>
      <BackButton />
      <div className="text-center mt-8">
        <p className="text-lg text-muted-foreground mb-6">给你们选好了 💕</p>
        <AnimatePresence mode="wait">
          <motion.div
            key={key}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.35 }}
            className="love-card mx-auto max-w-xs py-8"
          >
            <span className="text-5xl block mb-3">{activity.emoji}</span>
            <h2 className="text-xl font-bold mb-2">{activity.title}</h2>
            <p className="text-sm text-muted-foreground italic">
              "{activity.quote}"
            </p>
          </motion.div>
        </AnimatePresence>

        <button
          onClick={reroll}
          className="mt-6 text-primary font-medium text-sm hover:underline"
        >
          🔄 换一个
        </button>

        <button
          onClick={start}
          className="mt-4 w-full max-w-xs mx-auto block bg-primary text-primary-foreground py-3 rounded-2xl font-semibold shadow-soft hover:shadow-hover transition-all"
        >
          ❤️ 开始这次约会
        </button>
      </div>
    </PageWrapper>
  );
}
