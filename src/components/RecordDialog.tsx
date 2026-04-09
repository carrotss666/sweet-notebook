import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { saveMemory, uploadImages } from "@/lib/cloudStore";
import ImageUploader, { type ImageItem } from "@/components/ImageUploader";

interface Props {
  activity: string;
  emoji: string;
  onClose: () => void;
  onSaved?: () => void;
}

export default function RecordDialog({ activity, emoji, onClose, onSaved }: Props) {
  const navigate = useNavigate();
  const [note, setNote] = useState("");
  const [images, setImages] = useState<ImageItem[]>([]);
  const [mood, setMood] = useState("😊");
  const [saving, setSaving] = useState(false);

  const moods = ["😊", "😐", "😍", "😢", "🤩"];

  const handleSave = async () => {
    if (saving) return;
    try {
      setSaving(true);
      // Upload new images
      const newFiles = images.filter((img) => img.file).map((img) => img.file!);
      const fileIDs = newFiles.length > 0 ? await uploadImages(newFiles) : [];

      await saveMemory({
        date: new Date().toISOString().slice(0, 10).replace(/-/g, "."),
        activity,
        emoji,
        note,
        images: fileIDs,
        mood,
      });
      // Task status update handled by parent via onSaved
      onSaved?.();
      navigate("/save-success");
    } catch (e) {
      console.error("Save failed:", e);
      setSaving(false);
    }
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
          今天心情如何？
        </label>
        <div className="flex gap-2 mb-4">
          {moods.map((m) => (
            <button
              key={m}
              onClick={() => setMood(m)}
              className={`text-2xl transition-transform ${mood === m ? "scale-125 ring-2 ring-primary rounded-full" : "opacity-60 hover:opacity-100"}`}
            >
              {m}
            </button>
          ))}
        </div>

        <label className="text-sm text-muted-foreground block mb-2">
          今天感觉怎么样？💭
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="写一句话…"
          className="w-full bg-secondary rounded-xl p-3 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
        />

        <div className="mt-4">
          <ImageUploader images={images} onChange={setImages} />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-6 w-full bg-primary text-primary-foreground py-3 rounded-2xl font-semibold shadow-soft disabled:opacity-60"
        >
          {saving ? "保存中…" : "✅ 保存回忆"}
        </button>
      </motion.div>
    </motion.div>
  );
}
