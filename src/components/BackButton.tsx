import { useNavigate } from "react-router-dom";

export default function BackButton() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(-1)}
      className="text-muted-foreground hover:text-foreground transition-colors text-sm mb-4 flex items-center gap-1"
    >
      ← 返回
    </button>
  );
}
