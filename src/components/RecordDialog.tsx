import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { saveMemory, uploadImages } from "@/lib/cloudStore";
import ImageUploader, { type ImageItem } from "@/components/ImageUploader";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Props {
  activity: string;
  content?: string;
  emoji: string;
  onClose: () => void;
  onSaved?: () => void;
}

export default function RecordDialog({ activity, content, emoji, onClose, onSaved }: Props) {
  const navigate = useNavigate();
  const [title, setTitle] = useState(activity);
  const [note, setNote] = useState(content || "");
  const [images, setImages] = useState<ImageItem[]>([]);
  const [mood, setMood] = useState("😊");
  const [eventDate, setEventDate] = useState<Date>(new Date());
  const [saving, setSaving] = useState(false);

  const moods = ["😊", "😐", "😍", "😢", "🤩"];

  const formatDateStr = (d: Date) =>
    `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;

  const handleSave = async () => {
    if (saving || !title.trim()) return;
    try {
      setSaving(true);
      const newFiles = images.filter((img) => img.file).map((img) => img.file!);
      const fileIDs = newFiles.length > 0 ? await uploadImages(newFiles) : [];
      const dateStr = formatDateStr(eventDate);

      await saveMemory({
        date: dateStr,
        activity: title.trim(),
        emoji,
        note,
        images: fileIDs,
        mood,
        eventDate: dateStr,
      });
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
        className="bg-card w-full max-w-md rounded-t-3xl p-6 pb-8 max-h-[85vh] overflow-y-auto"
      >
        <h3 className="text-center text-lg font-bold mb-4">记录一下今天 💕</h3>

        <label className="text-sm text-muted-foreground block mb-2">
          📅 活动发生日期
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal mb-4",
                "bg-secondary border-0"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(eventDate, "yyyy年M月d日")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={eventDate}
              onSelect={(d) => d && setEventDate(d)}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>

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

        <label className="text-sm text-muted-foreground block mb-2">标题</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="标题…"
          className="w-full bg-secondary rounded-xl px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />

        <label className="text-sm text-muted-foreground block mb-2">
          详细内容 💭
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="写点什么…"
          className="w-full bg-secondary rounded-xl p-3 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
        />

        <div className="mt-4">
          <ImageUploader images={images} onChange={setImages} />
        </div>

        <button
          onClick={handleSave}
          disabled={saving || !title.trim()}
          className="mt-6 w-full bg-primary text-primary-foreground py-3 rounded-2xl font-semibold shadow-soft disabled:opacity-60"
        >
          {saving ? "保存中…" : "✅ 保存回忆"}
        </button>
      </motion.div>
    </motion.div>
  );
}
