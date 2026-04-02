import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "@/components/PageWrapper";
import BackButton from "@/components/BackButton";

export default function CustomDecide() {
  const navigate = useNavigate();
  const [text, setText] = useState("");

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

      <button
        disabled={!text.trim()}
        onClick={() =>
          navigate("/in-progress", { state: { emoji: "💕", title: text.trim() } })
        }
        className="mt-6 w-full bg-primary text-primary-foreground py-3 rounded-2xl font-semibold shadow-soft disabled:opacity-40 transition-all"
      >
        ❤️ 开始这次约会
      </button>
    </PageWrapper>
  );
}
