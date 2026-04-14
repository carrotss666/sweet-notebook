import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "@/components/PageWrapper";
import BackButton from "@/components/BackButton";
import { addTask } from "@/lib/cloudStore";
import SchedulePicker from "@/components/SchedulePicker";

export default function CustomDecide() {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [starting, setStarting] = useState(false);
  const [scheduledAt, setScheduledAt] = useState<string | undefined>(undefined);

  const start = async () => {
    if (!text.trim() || starting) return;
    setStarting(true);
    const lines = text.trim().split("\n");
    const title = lines[0].trim();
    const content = lines.slice(1).join("\n").trim() || undefined;
    await addTask({
      emoji: "💕",
      title,
      content,
      source: "manual",
      scheduledAt,
    });
    navigate("/");
  };

  return (
    <PageWrapper>
      <BackButton />
      <div className="text-center mt-8 mb-6">
        <p className="text-lg text-muted-foreground">今天你们决定做什么？💭</p>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="输入内容…（比如：火锅）"
        className="w-full bg-card rounded-2xl p-4 text-sm resize-none h-28 focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-soft transition-all"
      />

      <div className="mt-4">
        <SchedulePicker value={scheduledAt} onChange={setScheduledAt} />
      </div>

      <button
        disabled={!text.trim() || starting}
        onClick={start}
        className="mt-6 w-full bg-primary text-primary-foreground py-3 rounded-2xl font-semibold shadow-soft disabled:opacity-40 transition-all"
      >
        {starting ? "添加中…" : "📋 加入待办"}
      </button>
    </PageWrapper>
  );
}
