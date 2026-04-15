import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import BackButton from "@/components/BackButton";
import { saveMemory, uploadImages } from "@/lib/cloudStore";
import ImageUploader, { type ImageItem } from "@/components/ImageUploader";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export default function AddMemory() {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [note, setNote] = useState("");
  const [images, setImages] = useState<ImageItem[]>([]);
  const [eventDate, setEventDate] = useState<Date>(new Date());
  const [saving, setSaving] = useState(false);

  const formatDateStr = (d: Date) =>
    `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;

  const handleSave = async () => {
    if (!text.trim() || saving) return;
    try {
      setSaving(true);
      const newFiles = images.filter((img) => img.file).map((img) => img.file!);
      const fileIDs = newFiles.length > 0 ? await uploadImages(newFiles) : [];
      const dateStr = formatDateStr(eventDate);

      await saveMemory({
        date: dateStr,
        activity: text.trim(),
        emoji: "💕",
        note,
        images: fileIDs,
        eventDate: dateStr,
      });
      navigate("/save-success");
    } catch (e) {
      console.error("Save failed:", e);
      setSaving(false);
    }
  };

  return (
    <PageWrapper>
      <BackButton />
      <div className="text-center mb-6 mt-4">
        <p className="text-lg text-muted-foreground">今天做了什么？💭</p>
      </div>

      <label className="text-sm text-muted-foreground block mb-2">
        📅 活动发生日期
      </label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal mb-3",
              "bg-card border-0 shadow-soft"
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

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="输入内容…"
        className="w-full bg-card rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-soft mb-3"
      />

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="写一句话…（可选）"
        className="w-full bg-card rounded-2xl p-4 text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-soft mb-3"
      />

      <ImageUploader images={images} onChange={setImages} />

      <button
        disabled={!text.trim() || saving}
        onClick={handleSave}
        className="mt-4 w-full bg-primary text-primary-foreground py-3 rounded-2xl font-semibold shadow-soft disabled:opacity-40 transition-all"
      >
        {saving ? "保存中…" : "❤️ 保存回忆"}
      </button>
    </PageWrapper>
  );
}
