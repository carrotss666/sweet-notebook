import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import BackButton from "@/components/BackButton";
import { getRandomActivity } from "@/lib/recommend";
import { setPending } from "@/lib/store";

export default function RandomResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const customItems = (location.state as any)?.customItems as { emoji: string; title: string }[] | undefined;

  const getNext = () => {
    if (customItems && customItems.length > 0) {
      const item = customItems[Math.floor(Math.random() * customItems.length)];
      return { emoji: item.emoji, title: item.title, quote: "你们其实早就想去了吧 ✨" };
    }
    return getRandomActivity();
  };

  const [activity, setActivity] = useState(getNext);
  const [key, setKey] = useState(0);

  const reroll = () => {
    setActivity(getNext());
    setKey((k) => k + 1);
  };

  const start = () => {
    setPending({ emoji: activity.emoji, title: activity.title, startedAt: new Date().toISOString() });
    navigate("/");
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
          🔄 再抽一次
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
