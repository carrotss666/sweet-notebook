import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import BackButton from "@/components/BackButton";
import RecordDialog from "@/components/RecordDialog";

const encouragements = [
  "记得享受当下呀 ✨",
  "在一起就是最好的事 💕",
  "别看手机啦，看看对方 😊",
  "今天也是甜甜的一天 🍬",
];

export default function InProgress() {
  const location = useLocation();
  const navigate = useNavigate();
  const { emoji = "💕", title = "约会中" } = (location.state as any) || {};
  const [showRecord, setShowRecord] = useState(false);

  const quote = encouragements[Math.floor(Math.random() * encouragements.length)];

  return (
    <PageWrapper>
      <BackButton />
      <div className="text-center mt-12">
        <p className="text-lg text-muted-foreground mb-6">约会进行中… 💕</p>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-5xl mb-4"
        >
          {emoji}
        </motion.div>
        <h2 className="text-xl font-bold mb-3">{title}</h2>
        <p className="text-sm text-muted-foreground italic">"{quote}"</p>

        <div className="mt-12 space-y-3 max-w-xs mx-auto">
          <p className="text-sm text-muted-foreground">✅ 已完成今天的约会？</p>
          <button
            onClick={() => setShowRecord(true)}
            className="w-full bg-primary text-primary-foreground py-3 rounded-2xl font-semibold shadow-soft hover:shadow-hover transition-all"
          >
            记录一下
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-secondary text-secondary-foreground py-3 rounded-2xl font-medium transition-all"
          >
            稍后再说
          </button>
        </div>
      </div>

      {showRecord && (
        <RecordDialog
          activity={title}
          emoji={emoji}
          onClose={() => setShowRecord(false)}
        />
      )}
    </PageWrapper>
  );
}
