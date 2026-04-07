import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import BottomNav from "@/components/BottomNav";
import {
  getChecklist,
  addChecklistItem,
  removeChecklistItem,
  updateChecklistItem,
  generateId,
  type ChecklistItem,
} from "@/lib/store";

const EMOJI_OPTIONS = ["🎯", "🍜", "🚶", "📸", "🎬", "🧁", "🌃", "🎨", "☕", "🎵", "🛒", "📖", "🍳", "🏃", "🌸"];

function Stars({ rating, onChange }: { rating: number; onChange: (r: number) => void }) {
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

interface EditFormProps {
  initial?: ChecklistItem;
  onSave: (item: { emoji: string; title: string; rating: number }) => void;
  onCancel: () => void;
  title: string;
}

function EditForm({ initial, onSave, onCancel, title: formTitle }: EditFormProps) {
  const [emoji, setEmoji] = useState(initial?.emoji || "🎯");
  const [title, setTitle] = useState(initial?.title || "");
  const [rating, setRating] = useState(initial?.rating || 3);

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="love-card mb-4 space-y-3"
    >
      <h3 className="font-semibold text-sm">{formTitle}</h3>
      
      <div>
        <p className="text-xs text-muted-foreground mb-1">内容👇</p>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="想做什么…"
          className="w-full bg-secondary rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <div>
        <p className="text-xs text-muted-foreground mb-1">图标👇</p>
        <div className="flex flex-wrap gap-1.5">
          {EMOJI_OPTIONS.map((e) => (
            <button
              key={e}
              onClick={() => setEmoji(e)}
              className={`text-xl p-1 rounded-lg transition-all ${emoji === e ? "bg-primary/20 scale-110" : "hover:bg-secondary"}`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs text-muted-foreground mb-1">星级👇</p>
        <Stars rating={rating} onChange={setRating} />
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => { if (title.trim()) onSave({ emoji, title: title.trim(), rating }); }}
          className="flex-1 bg-primary text-primary-foreground py-2 rounded-xl font-medium text-sm"
        >
          ✅ 保存
        </button>
        <button
          onClick={onCancel}
          className="px-4 bg-secondary text-secondary-foreground py-2 rounded-xl text-sm"
        >
          取消
        </button>
      </div>
    </motion.div>
  );
}

export default function Checklist() {
  const [items, setItems] = useState<ChecklistItem[]>(getChecklist);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAdd = (data: { emoji: string; title: string; rating: number }) => {
    const item: ChecklistItem = { id: generateId(), ...data };
    addChecklistItem(item);
    setItems(getChecklist());
    setShowAdd(false);
  };

  const handleEdit = (id: string, data: { emoji: string; title: string; rating: number }) => {
    updateChecklistItem({ id, ...data });
    setItems(getChecklist());
    setEditingId(null);
  };

  const handleRemove = (id: string) => {
    removeChecklistItem(id);
    setItems(getChecklist());
  };

  return (
    <>
      <PageWrapper>
        <h1 className="text-xl font-bold mb-4">恋恋清单 ✨</h1>

        <button
          onClick={() => { setShowAdd(!showAdd); setEditingId(null); }}
          className="w-full bg-secondary text-secondary-foreground py-3 rounded-2xl font-medium mb-4 transition-all hover:bg-love-blush"
        >
          + 添加一件小事
        </button>

        <AnimatePresence>
          {showAdd && (
            <EditForm
              title="添加一件小事 ✨"
              onSave={handleAdd}
              onCancel={() => setShowAdd(false)}
            />
          )}
        </AnimatePresence>

        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={item.id}>
              {editingId === item.id ? (
                <AnimatePresence>
                  <EditForm
                    title="编辑小事 ✏️"
                    initial={item}
                    onSave={(data) => handleEdit(item.id, data)}
                    onCancel={() => setEditingId(null)}
                  />
                </AnimatePresence>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="love-card"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{item.emoji}</span>
                    <span className="flex-1 text-sm font-medium">{item.title}</span>
                    <Stars rating={item.rating} onChange={(r) => handleEdit(item.id, { ...item, rating: r })} />
                  </div>
                  <div className="flex gap-3 mt-2 pt-2 border-t border-border">
                    <button
                      onClick={() => { setEditingId(item.id); setShowAdd(false); }}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      ✏️ 编辑
                    </button>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-xs text-muted-foreground hover:text-destructive"
                    >
                      🗑 删除
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </PageWrapper>
      <BottomNav />
    </>
  );
}
