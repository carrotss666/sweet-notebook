import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import BottomNav from "@/components/BottomNav";

const actions = [
  {
    emoji: "🎰",
    title: "抽一个",
    desc: "随机决定，不用纠结",
    path: "/random",
  },
  {
    emoji: "✨",
    title: "看看推荐",
    desc: "按心情帮你选",
    path: "/recommend",
  },
  {
    emoji: "✍️",
    title: "自己决定",
    desc: "已经有想法了",
    path: "/custom",
  },
];

export default function Index() {
  const navigate = useNavigate();

  return (
    <>
      <PageWrapper>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-bold tracking-tight">
            恋恋笔记本 <span className="text-primary">❤️</span>
          </h1>
          <p className="text-muted-foreground mt-3 text-base">
            今天要做什么？🎯
          </p>
        </motion.div>

        <div className="space-y-4">
          {actions.map((action, i) => (
            <motion.button
              key={action.path}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.1, duration: 0.4 }}
              onClick={() => navigate(action.path)}
              className="love-card-interactive w-full text-left flex items-center gap-4"
            >
              <span className="text-3xl">{action.emoji}</span>
              <div className="flex-1">
                <div className="font-semibold text-base">{action.title}</div>
                <div className="text-sm text-muted-foreground mt-0.5">
                  {action.desc}
                </div>
              </div>
              <span className="text-muted-foreground text-lg">→</span>
            </motion.button>
          ))}
        </div>
      </PageWrapper>
      <BottomNav />
    </>
  );
}
