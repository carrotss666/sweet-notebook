import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import BackButton from "@/components/BackButton";
import { getUserProfile, setUserProfile, getCurrentUid } from "@/lib/cloudStore";
import { getCoupleId } from "@/lib/tcb";
import { toast } from "sonner";

const AVATAR_EMOJIS = ["👦", "👧", "👩", "👨", "🐱", "🐶", "🦊", "🐼", "🐰", "🌸", "⭐", "🌈", "🎀", "🧸", "💎"];

export default function ProfileSettings() {
  const [nickname, setNickname] = useState("");
  const [avatar, setAvatar] = useState("👦");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const coupleCode = getCoupleId();

  useEffect(() => {
    (async () => {
      const uid = await getCurrentUid();
      const profile = await getUserProfile(uid);
      if (profile) {
        setNickname(profile.nickname);
        setAvatar(profile.avatar);
      }
      setLoading(false);
    })();
  }, []);

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    await setUserProfile({ nickname: nickname.trim() || "我", avatar });
    setSaving(false);
    toast.success("保存成功 ✅");
  };

  if (loading) {
    return (
      <PageWrapper>
        <BackButton />
        <div className="text-center text-muted-foreground py-12">加载中…</div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <BackButton />
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 space-y-6">
        <h1 className="text-xl font-bold">个人设置 ⚙️</h1>

        {/* Avatar */}
        <div>
          <p className="text-sm font-medium mb-2">选择头像</p>
          <div className="flex flex-wrap gap-2">
            {AVATAR_EMOJIS.map((e) => (
              <button
                key={e}
                onClick={() => setAvatar(e)}
                className={`text-2xl p-2 rounded-xl transition-all ${
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
        <div className="love-card flex items-center gap-3">
          <span className="text-3xl">{avatar}</span>
          <span className="text-sm font-medium">{nickname || "我"}</span>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-primary text-primary-foreground py-3 rounded-2xl font-semibold disabled:opacity-60"
        >
          {saving ? "保存中…" : "保存设置 ✅"}
        </button>

        {/* Couple code */}
        <div className="text-center pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground mb-1">当前邀请码</p>
          <p className="text-lg font-mono font-bold text-primary tracking-widest">{coupleCode}</p>
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
      </motion.div>
    </PageWrapper>
  );
}
