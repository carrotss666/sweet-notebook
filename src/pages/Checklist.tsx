import { useState } from "react";
import { motion } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import BottomNav from "@/components/BottomNav";
import {
  getChecklist,
  addChecklistItem,
  removeChecklistItem,
  saveChecklist,
  generateId,
  type ChecklistItem,
} from "@/lib/store";

function Stars({
  rating,
  onChange,
}: {
  rating: number;
  onChange: (r: number) => void;
}) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          className="text-sm transition-transform hover:scale-110"
        >
          {n <= rating ? "⭐" : "☆"}
        </button>
      ))}
    </div>
  );
}

export default function Checklist() {
  const [items, setItems] = useState<ChecklistItem[]>(getChecklist);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newEmoji, setNewEmoji] = useState("🎯");

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    const item: ChecklistItem = {
      id: generateId(),
      emoji: newEmoji,
      title: newTitle.trim(),
      rating: 3,
    };
    addChecklistItem(item);
    setItems(getChecklist());
    setNewTitle("");
    setShowAdd(false);
  };

  const handleRemove = (id: string) => {
    removeChecklistItem(id);
    setItems(getChecklist());
  };

  const handleRating = (id: string, rating: number) => {
    const updated = items.map((i) => (i.id === id ? { ...i, rating } : i));
    saveChecklist(updated);
    setItems(updated);
  };

  return (
    <>
      <PageWrapper>
        <h1 className="text-xl font-bold mb-4">恋恋清单 ✨</h1>

        <button
          onClick={() => setShowAdd(!showAdd)}
          className="w-full bg-secondary text-secondary-foreground py-3 rounded-2xl font-medium mb-4 transition-all hover:bg-love-blush"
        >
          + 添加一件小事
        </button>

        {showAdd && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="love-card mb-4 space-y-3"
          >
            <div className="flex gap-2">
              <select
                value={newEmoji}
                onChange={(e) => setNewEmoji(e.target.value)}
                className="bg-secondary rounded-xl px-3 py-2 text-lg"
              >
                {["🎯", "🍜", "🚶", "📸", "🎬", "🧁", "🌃", "🎨", "☕", "🎵"].map(
                  (e) => (
                    <option key={e} value={e}>
                      {e}
                    </option>
                  )
                )}
              </select>
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="想做什么…"
                className="flex-1 bg-secondary rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <button
              onClick={handleAdd}
              className="w-full bg-primary text-primary-foreground py-2 rounded-xl font-medium text-sm"
            >
              添加
            </button>
          </motion.div>
        )}

        <div className="space-y-2">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="love-card flex items-center gap-3"
            >
              <span className="text-xl">{item.emoji}</span>
              <span className="flex-1 text-sm font-medium">{item.title}</span>
              <Stars
                rating={item.rating}
                onChange={(r) => handleRating(item.id, r)}
              />
              <button
                onClick={() => handleRemove(item.id)}
                className="text-muted-foreground hover:text-destructive text-xs ml-1"
              >
                ✕
              </button>
            </motion.div>
          ))}
        </div>
      </PageWrapper>
      <BottomNav />
    </>
  );
}
