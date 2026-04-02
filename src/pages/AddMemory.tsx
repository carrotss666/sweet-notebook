import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "@/components/PageWrapper";
import BackButton from "@/components/BackButton";
import { saveMemory, generateId } from "@/lib/store";

export default function AddMemory() {
  const navigate = useNavigate();
  const [text, setText] = useState("");
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
    if (!text.trim()) return;
    saveMemory({
      id: generateId(),
      date: new Date().toISOString().slice(0, 10).replace(/-/g, "."),
      activity: text.trim(),
      emoji: "💕",
      note,
      photo,
    });
    navigate("/save-success");
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

      <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer mb-2">
        📸 + 上传图片（可选）
        <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
      </label>
      {photo && (
        <img src={photo} alt="preview" className="rounded-xl w-20 h-20 object-cover mb-3" />
      )}

      <button
        disabled={!text.trim()}
        onClick={handleSave}
        className="mt-4 w-full bg-primary text-primary-foreground py-3 rounded-2xl font-semibold shadow-soft disabled:opacity-40 transition-all"
      >
        ❤️ 保存回忆
      </button>
    </PageWrapper>
  );
}
