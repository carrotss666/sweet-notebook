import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "@/components/PageWrapper";
import BackButton from "@/components/BackButton";
import { saveMemory, uploadImages } from "@/lib/cloudStore";
import ImageUploader, { type ImageItem } from "@/components/ImageUploader";

export default function AddMemory() {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [note, setNote] = useState("");
  const [images, setImages] = useState<ImageItem[]>([]);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!text.trim() || saving) return;
    try {
      setSaving(true);
      const newFiles = images.filter((img) => img.file).map((img) => img.file!);
      const fileIDs = newFiles.length > 0 ? await uploadImages(newFiles) : [];

      await saveMemory({
        date: new Date().toISOString().slice(0, 10).replace(/-/g, "."),
        activity: text.trim(),
        emoji: "💕",
        note,
        images: fileIDs,
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
