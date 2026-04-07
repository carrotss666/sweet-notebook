import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import BackButton from "@/components/BackButton";

const EMOJI_OPTIONS = ["🍜", "🎬", "🚶", "📸", "🧁", "🌃", "🎨", "☕", "🎵", "🎲", "🏃", "🌸"];

interface WheelItem {
  id: string;
  emoji: string;
  title: string;
}

export default function CustomWheel() {
  const navigate = useNavigate();
  const [items, setItems] = useState<WheelItem[]>([
    { id: "1", emoji: "🍜", title: "火锅" },
    { id: "2", emoji: "🎬", title: "电影" },
    { id: "3", emoji: "🚶", title: "散步" },
  ]);
  const [newTitle, setNewTitle] = useState("");
  const [newEmoji, setNewEmoji] = useState("🎯");

  const addItem = () => {
    if (!newTitle.trim()) return;
    setItems([...items, { id: Date.now().toString(), emoji: newEmoji, title: newTitle.trim() }]);
    setNewTitle("");
  };

  const removeItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const startSpin = () => {
    if (items.length < 2) return;
    navigate("/random-result", { state: { customItems: items } });
  };

  return (
    <PageWrapper>
      <BackButton />
      <div className="text-center mt-4 mb-6">
        <p className="text-lg text-muted-foreground">做决定有点难？💭</p>
        <p className="text-sm text-muted-foreground mt-1">添加几个选项吧👇</p>
      </div>

      <div className="space-y-2 mb-4">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="love-card flex items-center gap-3 py-3"
          >
            <span className="text-xl">{item.emoji}</span>
            <span className="flex-1 text-sm font-medium">{item.title}</span>
            <button
              onClick={() => removeItem(item.id)}
              className="text-muted-foreground hover:text-destructive text-xs"
            >
              ✕
            </button>
          </motion.div>
        ))}
      </div>

      <div className="love-card mb-4 space-y-3">
        <div className="flex gap-2">
          <select
            value={newEmoji}
            onChange={(e) => setNewEmoji(e.target.value)}
            className="bg-secondary rounded-xl px-3 py-2 text-lg"
          >
            {EMOJI_OPTIONS.map((e) => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addItem()}
            placeholder="添加一个选项…"
            className="flex-1 bg-secondary rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <button
          onClick={addItem}
          className="w-full bg-secondary text-secondary-foreground py-2 rounded-xl font-medium text-sm hover:bg-love-blush transition-all"
        >
          + 添加一个选项
        </button>
      </div>

      <button
        disabled={items.length < 2}
        onClick={startSpin}
        className="w-full bg-primary text-primary-foreground py-3 rounded-2xl font-semibold shadow-soft disabled:opacity-40 transition-all"
      >
        🎰 开始抽签
      </button>
    </PageWrapper>
  );
}
