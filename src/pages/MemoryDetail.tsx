import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import BackButton from "@/components/BackButton";
import ImageUploader, { type ImageItem } from "@/components/ImageUploader";
import ImageLightbox from "@/components/ImageLightbox";
import {
  getMemoryById,
  updateMemory,
  deleteMemory,
  uploadImages,
  getImageUrls,
  deleteCloudFile,
  getComments,
  addComment,
  deleteComment,
  getCurrentUid,
  getCoupleProfiles,
  type CloudMemory,
  type CloudComment,
  type CloudUserProfile,
} from "@/lib/cloudStore";

const MOODS = ["😊", "😐", "😍", "😢", "🤩"];

export default function MemoryDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [memory, setMemory] = useState<CloudMemory | null>(null);
  const [comments, setComments] = useState<CloudComment[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUid, setCurrentUid] = useState("");
  const [profiles, setProfiles] = useState<CloudUserProfile[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const [commentText, setCommentText] = useState("");
  const [sendingComment, setSendingComment] = useState(false);

  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editNote, setEditNote] = useState("");
  const [editMood, setEditMood] = useState("😊");
  const [editImages, setEditImages] = useState<ImageItem[]>([]);
  const [saving, setSaving] = useState(false);

  const refresh = async () => {
    if (!id) return;
    const [mem, cmts, uid, profs] = await Promise.all([
      getMemoryById(id),
      getComments(id),
      getCurrentUid(),
      getCoupleProfiles(),
    ]);
    setMemory(mem);
    setComments(cmts);
    setCurrentUid(uid);
    setProfiles(profs);
    if (mem?.images && mem.images.length > 0) {
      const urls = await getImageUrls(mem.images);
      setImageUrls(urls);
    } else {
      setImageUrls([]);
    }
    setLoading(false);
  };

  useEffect(() => { refresh(); }, [id]);

  const getAuthorDisplay = (authorId: string) => {
    const isMe = authorId === currentUid;
    const profile = profiles.find((p) => p.userId === authorId);
    const avatar = profile?.avatar || (isMe ? "👦" : "👧");
    const name = profile?.nickname || (isMe ? "我" : "TA");
    return { avatar, name, isMe, label: `${avatar} ${name}` };
  };

  const handleDeleteMemory = async () => {
    if (!memory?._id) return;
    if (memory.images) {
      for (const fid of memory.images) {
        try { await deleteCloudFile(fid); } catch {}
      }
    }
    await deleteMemory(memory._id);
    navigate(-1);
  };

  const startEdit = async () => {
    if (!memory) return;
    setEditTitle(memory.activity);
    setEditNote(memory.note);
    setEditMood(memory.mood || "😊");
    if (memory.images && memory.images.length > 0) {
      const urls = await getImageUrls(memory.images);
      setEditImages(memory.images.map((fid, i) => ({ fileID: fid, preview: urls[i] })));
    } else {
      setEditImages([]);
    }
    setEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!memory?._id || !editTitle.trim() || saving) return;
    setSaving(true);
    try {
      const newFiles = editImages.filter((img) => img.file).map((img) => img.file!);
      const newFileIDs = newFiles.length > 0 ? await uploadImages(newFiles) : [];
      const existingFileIDs = editImages.filter((img) => img.fileID).map((img) => img.fileID!);
      const allFileIDs = [...existingFileIDs, ...newFileIDs];

      const removedIDs = (memory.images || []).filter((id) => !existingFileIDs.includes(id));
      for (const rid of removedIDs) {
        try { await deleteCloudFile(rid); } catch {}
      }

      await updateMemory(memory._id, {
        activity: editTitle.trim(),
        note: editNote,
        mood: editMood,
        images: allFileIDs,
      });
      setEditing(false);
      setSaving(false);
      await refresh();
    } catch (e) {
      console.error("Save failed:", e);
      setSaving(false);
    }
  };

  const handleSendComment = async () => {
    if (!id || !commentText.trim() || sendingComment) return;
    setSendingComment(true);
    await addComment(id, commentText.trim());
    setCommentText("");
    setSendingComment(false);
    const cmts = await getComments(id);
    setComments(cmts);
  };

  const handleDeleteComment = async (commentId: string) => {
    await deleteComment(commentId);
    setComments((prev) => prev.filter((c) => c._id !== commentId));
  };

  if (loading) {
    return (
      <PageWrapper>
        <BackButton />
        <div className="text-center text-muted-foreground py-12">加载中…</div>
      </PageWrapper>
    );
  }

  if (!memory) {
    return (
      <PageWrapper>
        <BackButton />
        <div className="text-center text-muted-foreground py-12">回忆不存在</div>
      </PageWrapper>
    );
  }

  const memoryAuthor = getAuthorDisplay(memory.authorId || "");

  return (
    <>
      <PageWrapper>
        <BackButton />

        {editing ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 space-y-4">
            <h2 className="text-lg font-bold">✏️ 编辑回忆</h2>
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="标题…"
              className="w-full bg-secondary rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <div className="flex gap-2">
              {MOODS.map((m) => (
                <button
                  key={m}
                  onClick={() => setEditMood(m)}
                  className={`text-xl transition-transform ${editMood === m ? "scale-125 ring-2 ring-primary rounded-full" : "opacity-50"}`}
                >
                  {m}
                </button>
              ))}
            </div>
            <textarea
              value={editNote}
              onChange={(e) => setEditNote(e.target.value)}
              placeholder="写点什么…"
              className="w-full bg-secondary rounded-xl p-3 text-sm resize-none h-32 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <ImageUploader images={editImages} onChange={setEditImages} />
            <div className="flex gap-2">
              <button
                onClick={handleSaveEdit}
                disabled={saving}
                className="flex-1 bg-primary text-primary-foreground py-2 rounded-xl text-sm font-medium disabled:opacity-60"
              >
                {saving ? "保存中…" : "保存"}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="px-4 bg-secondary text-secondary-foreground py-2 rounded-xl text-sm"
              >
                取消
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{memory.mood || memory.emoji}</span>
              <div className="flex-1">
                <h2 className="text-lg font-bold">{memory.activity}</h2>
                <p className="text-xs text-muted-foreground">
                  📅 {memory.date} · {memoryAuthor.label}
                </p>
              </div>
            </div>

            {memory.note && (
              <div className="love-card mb-4">
                <p className="text-sm" style={{ whiteSpace: "pre-wrap" }}>
                  {memory.note}
                </p>
              </div>
            )}

            {imageUrls.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {imageUrls.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt=""
                    onClick={() => setLightboxIndex(i)}
                    className="rounded-xl w-24 h-24 object-cover cursor-pointer hover:opacity-80 transition-opacity"
                  />
                ))}
              </div>
            )}

            <div className="flex gap-2 mb-6">
              <button
                onClick={startEdit}
                className="flex-1 bg-secondary text-secondary-foreground py-2 rounded-xl text-sm font-medium"
              >
                ✏️ 编辑
              </button>
              <button
                onClick={handleDeleteMemory}
                className="px-4 bg-destructive text-destructive-foreground py-2 rounded-xl text-sm font-medium"
              >
                🗑 删除
              </button>
            </div>

            {/* Comments */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3">💬 对话记录</h3>
              {comments.length === 0 && (
                <p className="text-xs text-muted-foreground mb-2">还没有对话内容，开始写下你们的故事吧 💕</p>
              )}
              <div className="space-y-2">
                {comments.map((c) => {
                  const author = getAuthorDisplay(c.authorId);
                  return (
                    <motion.div
                      key={c._id}
                      initial={{ opacity: 0, x: author.isMe ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex ${author.isMe ? "justify-end" : "justify-start"}`}
                    >
                      {!author.isMe && (
                        <span className="text-2xl mr-2 self-end">{author.avatar}</span>
                      )}
                      <div
                        className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
                          author.isMe
                            ? "bg-primary text-primary-foreground rounded-br-sm"
                            : "bg-secondary text-secondary-foreground rounded-bl-sm"
                        }`}
                      >
                        <p className="text-[10px] opacity-70 mb-0.5">{author.label}</p>
                        <p style={{ whiteSpace: "pre-wrap" }}>{c.content}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[9px] opacity-50">
                            {new Date(c.createdAt).toLocaleString("zh-CN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </span>
                          {author.isMe && (
                            <button
                              onClick={() => handleDeleteComment(c._id!)}
                              className="text-[9px] opacity-50 hover:opacity-100 ml-2"
                            >
                              删除
                            </button>
                          )}
                        </div>
                      </div>
                      {author.isMe && (
                        <span className="text-2xl ml-2 self-end">{author.avatar}</span>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-2 items-end sticky bottom-0 bg-background pt-2 pb-4">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="写下你想说的…"
                rows={2}
                className="flex-1 bg-secondary rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <button
                onClick={handleSendComment}
                disabled={!commentText.trim() || sendingComment}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-50 shrink-0"
              >
                {sendingComment ? "…" : "发送"}
              </button>
            </div>
          </motion.div>
        )}
      </PageWrapper>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <ImageLightbox
            images={imageUrls}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
