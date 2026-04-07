import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import BackButton from "@/components/BackButton";

export default function RandomPick() {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <BackButton />
      <div className="text-center mt-8 mb-8">
        <p className="text-lg text-muted-foreground">怎么帮你选？💕</p>
      </div>

      <div className="space-y-4 max-w-xs mx-auto">
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => navigate("/random-result")}
          className="love-card-interactive w-full text-left flex items-center gap-4"
        >
          <span className="text-3xl">🎰</span>
          <div className="flex-1">
            <div className="font-semibold text-base">随机抽一个</div>
            <div className="text-sm text-muted-foreground mt-0.5">从系统活动中随机选</div>
          </div>
          <span className="text-muted-foreground text-lg">→</span>
        </motion.button>

        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => navigate("/custom-wheel")}
          className="love-card-interactive w-full text-left flex items-center gap-4"
        >
          <span className="text-3xl">🛠</span>
          <div className="flex-1">
            <div className="font-semibold text-base">自定义小转盘</div>
            <div className="text-sm text-muted-foreground mt-0.5">在几个选项中帮你决定</div>
          </div>
          <span className="text-muted-foreground text-lg">→</span>
        </motion.button>
      </div>
    </PageWrapper>
  );
}
