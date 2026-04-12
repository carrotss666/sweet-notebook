import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { getCoupleId } from "@/lib/tcb";

const AVATAR_EMOJIS = ["👦", "👧", "👩", "👨", "🐱", "🐶", "🦊", "🐼", "🐰", "🌸", "⭐", "🌈", "🎀", "🧸", "💎"];

const STORAGE_KEY = "user_profile";

export interface UserProfile {
  avatar: string;
  nickname: string;
}

export function getLocalProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { avatar: "👦", nickname: "我" };
}

function saveLocalProfile(p: UserProfile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

export default function ProfileDialog() {
  const [open, setOpen] = useState(false);
  const [avatar, setAvatar] = useState("👦");
  const [nickname, setNickname] = useState("我");
  const coupleCode = getCoupleId();

  useEffect(() => {
    if (open) {
      const p = getLocalProfile();
      setAvatar(p.avatar);
      setNickname(p.nickname);
    }
  }, [open]);

  const handleSave = () => {
    saveLocalProfile({ avatar, nickname: nickname.trim() || "我" });
    toast.success("保存成功 ✅");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="text-2xl hover:scale-110 transition-transform" aria-label="个人设置">
          {getLocalProfile().avatar}
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-sm rounded-2xl">
        <DialogHeader>
          <DialogTitle>个人设置 ⚙️</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Avatar picker */}
          <div>
            <p className="text-sm font-medium mb-2">选择头像</p>
            <div className="flex flex-wrap gap-2">
              {AVATAR_EMOJIS.map((e) => (
                <button
                  key={e}
                  onClick={() => setAvatar(e)}
                  className={`text-2xl p-1.5 rounded-xl transition-all ${
                    avatar === e ? "bg-primary/20 scale-110 ring-2 ring-primary" : "hover:bg-secondary"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Nickname */}
          <div>
            <p className="text-sm font-medium mb-2">昵称</p>
            <input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="输入你的昵称…"
              maxLength={20}
              className="w-full bg-secondary rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* Preview */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
            <span className="text-3xl">{avatar}</span>
            <span className="text-sm font-medium">{nickname || "我"}</span>
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl font-semibold"
          >
            保存设置 ✅
          </button>

          {/* Couple code */}
          <div className="text-center pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground mb-1">当前邀请码</p>
            <p className="text-base font-mono font-bold text-primary tracking-widest">{coupleCode}</p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(coupleCode);
                toast.success("已复制邀请码");
              }}
              className="text-xs text-muted-foreground mt-1"
            >
              点击复制
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
