import { useState } from "react";
import { motion } from "framer-motion";
import SchedulePicker from "@/components/SchedulePicker";
import { updateTask, type CloudTask } from "@/lib/cloudStore";

interface Props {
  task: CloudTask;
  onClose: () => void;
  onUpdated: (task: CloudTask) => void;
}

export default function TaskEditDialog({ task, onClose, onUpdated }: Props) {
  const [title, setTitle] = useState(task.title);
  const [schedule, setSchedule] = useState<string | undefined>(task.scheduledAt);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim() || saving) return;
    setSaving(true);
    try {
      await updateTask(task._id!, { title: title.trim(), scheduledAt: schedule });
      onUpdated({ ...task, title: title.trim(), scheduledAt: schedule });
    } catch (e) {
      console.error("Update task failed:", e);
    }
    setSaving(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm flex items-end justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-card w-full max-w-md rounded-t-3xl p-6 pb-8 space-y-4"
      >
        <h3 className="text-center text-lg font-bold">编辑待办 ✏️</h3>

        <div>
          <p className="text-xs text-muted-foreground mb-1">标题</p>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-secondary rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <SchedulePicker value={schedule} onChange={setSchedule} />

        <div className="flex gap-2 pt-2">
          <button
            onClick={handleSave}
            disabled={saving || !title.trim()}
            className="flex-1 bg-primary text-primary-foreground py-3 rounded-2xl font-semibold text-sm disabled:opacity-60"
          >
            {saving ? "保存中…" : "✅ 保存"}
          </button>
          <button
            onClick={onClose}
            className="px-4 bg-secondary text-secondary-foreground py-3 rounded-2xl text-sm"
          >
            取消
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
