import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { saveMemory, generateId } from "@/lib/store";

interface Props {
  activity: string;
  emoji: string;
  onClose: () => void;
}

export default function RecordDialog({ activity, emoji, onClose }: Props) {
  const navigate = useNavigate();
  const [note, setNote] = useState("");
  const [photo, setPhoto] = useState<string | undefined>();

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    saveMemory({
      id: generateId(),
      date: new Date().toISOString().slice(0, 10).replace(/-/g, "."),
      activity,
      emoji,
      note,
      photo,
    });
    navigate("/save-success");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm flex items-end justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-card w-full max-w-md rounded-t-3xl p-6 pb-8"
      >
        <h3 className="text-center text-lg font-bold mb-4">记录一下今天 💕</h3>

        <label className="text-sm text-muted-foreground block mb-2">
          今天感觉怎么样？💭
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="写一句话…"
          className="w-full bg-secondary rounded-xl p-3 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
        />

        <label className="mt-4 flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
          📸 + 添加照片（可选）
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhoto}
          />
        </label>
        {photo && (
          <img
            src={photo}
            alt="preview"
            className="mt-2 rounded-xl w-20 h-20 object-cover"
          />
        )}

        <button
          onClick={handleSave}
          className="mt-6 w-full bg-primary text-primary-foreground py-3 rounded-2xl font-semibold shadow-soft"
        >
          ✅ 保存回忆
        </button>
      </motion.div>
    </motion.div>
  );
}
