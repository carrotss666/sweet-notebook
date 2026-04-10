import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import BottomNav from "@/components/BottomNav";
import ImageUploader, { type ImageItem } from "@/components/ImageUploader";
import {
  getMemories,
  saveMemory,
  updateMemory,
  deleteMemory,
  uploadImages,
  getImageUrls,
  deleteCloudFile,
  type CloudMemory,
} from "@/lib/cloudStore";

const MOODS = ["😊", "😐", "😍", "😢", "🤩"];
const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function formatDate(y: number, m: number, d: number) {
  return `${y}.${String(m + 1).padStart(2, "0")}.${String(d).padStart(2, "0")}`;
}

interface DayDetailProps {
  date: string;
  memories: CloudMemory[];
  onClose: () => void;
  onRefresh: () => void;
}

function DayDetail({ date, memories, onClose, onRefresh }: DayDetailProps) {
  const navigate = useNavigate();
  const [editing, setEditing] = useState<CloudMemory | null>(null);
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [mood, setMood] = useState("😊");
  const [images, setImages] = useState<ImageItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [imageUrlMap, setImageUrlMap] = useState<Record<string, string>>({});

  // Load image URLs for all memories
  useEffect(() => {
    const allFileIDs = memories.flatMap((m) => m.images || []);
    if (allFileIDs.length === 0) return;
    getImageUrls(allFileIDs).then((urls) => {
      const map: Record<string, string> = {};
      allFileIDs.forEach((id, i) => { map[id] = urls[i]; });
      setImageUrlMap(map);
    });
  }, [memories]);

  const startEdit = async (m: CloudMemory) => {
    setEditing(m);
    setTitle(m.activity);
    setNote(m.note);
    setMood(m.mood || "😊");
    setAdding(false);
    // Convert existing images to ImageItems
    if (m.images && m.images.length > 0) {
      const urls = await getImageUrls(m.images);
      setImages(
        m.images.map((fileID, i) => ({ fileID, preview: urls[i] }))
      );
    } else {
      setImages([]);
    }
  };

  const startAdd = () => {
    setAdding(true);
    setEditing(null);
    setTitle("");
    setNote("");
    setMood("😊");
    setImages([]);
  };

  const handleSave = async () => {
    if (!title.trim() || saving) return;
    try {
      setSaving(true);
      // Upload new files
      const newFiles = images.filter((img) => img.file).map((img) => img.file!);
      const newFileIDs = newFiles.length > 0 ? await uploadImages(newFiles) : [];
      // Keep existing fileIDs
      const existingFileIDs = images.filter((img) => img.fileID).map((img) => img.fileID!);
      const allFileIDs = [...existingFileIDs, ...newFileIDs];

      if (editing) {
        // Delete removed images from cloud
        const removedIDs = (editing.images || []).filter((id) => !existingFileIDs.includes(id));
        for (const id of removedIDs) {
          try { await deleteCloudFile(id); } catch {}
        }
        await updateMemory(editing._id!, {
          activity: title.trim(),
          note,
          mood,
          images: allFileIDs,
        });
      } else {
        await saveMemory({
          date,
          activity: title.trim(),
          emoji: "💕",
          note,
          images: allFileIDs,
          mood,
        });
      }
      onRefresh();
      setSaving(false);
      setEditing(null);
      setAdding(false);
      setTitle("");
      setNote("");
      setMood("😊");
      setImages([]);
    } catch (e) {
      console.error("Save failed:", e);
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const mem = memories.find((m) => m._id === id);
    if (mem?.images) {
      for (const fid of mem.images) {
        try { await deleteCloudFile(fid); } catch {}
      }
    }
    await deleteMemory(id);
    onRefresh();
    setEditing(null);
  };

  const showForm = adding || editing;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm flex items-end justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-card w-full max-w-md rounded-t-3xl p-6 pb-8 max-h-[80vh] overflow-y-auto"
      >
        <h3 className="text-center text-lg font-bold mb-4">📅 {date}</h3>

        {memories.length === 0 && !showForm && (
          <p className="text-center text-muted-foreground text-sm mb-4">这一天还没有回忆</p>
        )}

        {memories.map((m) =>
          editing?._id === m._id ? null : (
            <div key={m._id} className="love-card mb-3">
              <div className="flex items-start gap-2">
                <span className="text-lg">{m.mood || m.emoji}</span>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{m.activity}</p>
                  {m.note && <p className="text-xs text-muted-foreground italic mt-1" style={{ whiteSpace: "pre-wrap" }}>"{m.note}"</p>}
                </div>
              </div>
              {m.images && m.images.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {m.images.map((fid) => (
                    <img
                      key={fid}
                      src={imageUrlMap[fid] || ""}
                      alt=""
                      className="rounded-xl w-16 h-16 object-cover"
                    />
                  ))}
                </div>
              )}
              <div className="flex gap-3 mt-2 pt-2 border-t border-border">
                <button onClick={() => navigate(`/memory/${m._id}`)} className="text-xs text-muted-foreground hover:text-foreground">
                  📖 详情
                </button>
                <button onClick={() => startEdit(m)} className="text-xs text-muted-foreground hover:text-foreground">
                  ✏️ 编辑
                </button>
                <button onClick={() => handleDelete(m._id!)} className="text-xs text-muted-foreground hover:text-destructive">
                  🗑 删除
                </button>
              </div>
            </div>
          )
        )}

        {showForm && (
          <div className="love-card mb-3 space-y-3">
            <p className="font-semibold text-sm">{editing ? "编辑回忆" : "新增回忆"}</p>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="标题…"
              className="w-full bg-secondary rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <div className="flex gap-2">
              {MOODS.map((m) => (
                <button
                  key={m}
                  onClick={() => setMood(m)}
                  className={`text-xl transition-transform ${mood === m ? "scale-125 ring-2 ring-primary rounded-full" : "opacity-50"}`}
                >
                  {m}
                </button>
              ))}
            </div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="写点什么…"
              className="w-full bg-secondary rounded-xl p-3 text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <ImageUploader images={images} onChange={setImages} />
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-primary text-primary-foreground py-2 rounded-xl text-sm font-medium disabled:opacity-60"
              >
                {saving ? "保存中…" : "保存"}
              </button>
              <button
                onClick={() => { setEditing(null); setAdding(false); }}
                className="px-4 bg-secondary text-secondary-foreground py-2 rounded-xl text-sm"
              >
                取消
              </button>
              {editing && (
                <button
                  onClick={() => handleDelete(editing._id!)}
                  className="px-4 bg-destructive text-destructive-foreground py-2 rounded-xl text-sm"
                >
                  删除
                </button>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-2 mt-2">
          {!showForm && (
            <button
              onClick={startAdd}
              className="flex-1 bg-primary text-primary-foreground py-2 rounded-xl text-sm font-medium"
            >
              + 新增回忆
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 bg-secondary text-secondary-foreground py-2 rounded-xl text-sm font-medium"
          >
            关闭
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Memories() {
  const [memories, setMemories] = useState<CloudMemory[]>([]);
  const [loading, setLoading] = useState(true);
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const refresh = async () => {
    const data = await getMemories();
    setMemories(data);
  };

  useEffect(() => {
    refresh().then(() => setLoading(false));
  }, []);

  const memoryByDate = useMemo(() => {
    const map: Record<string, CloudMemory[]> = {};
    memories.forEach((m) => {
      if (!map[m.date]) map[m.date] = [];
      map[m.date].push(m);
    });
    return map;
  }, [memories]);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(year - 1); }
    else setMonth(month - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(year + 1); }
    else setMonth(month + 1);
  };

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  const selectedMemories = selectedDate ? (memoryByDate[selectedDate] || []) : [];

  return (
    <>
      <PageWrapper>
        <h1 className="text-xl font-bold mb-4">📅 我们的回忆</h1>

        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="text-lg px-3 py-1 hover:bg-secondary rounded-xl">◀</button>
          <span className="font-semibold text-base">{year}年{month + 1}月</span>
          <button onClick={nextMonth} className="text-lg px-3 py-1 hover:bg-secondary rounded-xl">▶</button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-1">
          {WEEKDAYS.map((w) => (
            <div key={w} className="text-center text-xs text-muted-foreground font-medium py-1">{w}</div>
          ))}
        </div>

        {loading ? (
          <div className="text-center text-muted-foreground py-8">加载中…</div>
        ) : (
          <div className="grid grid-cols-7 gap-1 mb-4">
            {calendarDays.map((day, idx) => {
              if (day === null) return <div key={`empty-${idx}`} />;
              const dateStr = formatDate(year, month, day);
              const dayMemories = memoryByDate[dateStr];
              const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
              const moodEmoji = dayMemories?.[0]?.mood;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center text-xs transition-all hover:bg-primary/10 ${
                    isToday ? "ring-2 ring-primary bg-primary/5" : ""
                  } ${dayMemories ? "bg-love-blush" : ""}`}
                >
                  <span className="font-medium">{day}</span>
                  {moodEmoji && <span className="text-xs mt-0.5">{moodEmoji}</span>}
                </button>
              );
            })}
          </div>
        )}

        <div className="text-center text-xs text-muted-foreground">
          点击日期查看或添加回忆 💕
        </div>
      </PageWrapper>
      <BottomNav />

      <AnimatePresence>
        {selectedDate && (
          <DayDetail
            date={selectedDate}
            memories={selectedMemories}
            onClose={() => setSelectedDate(null)}
            onRefresh={refresh}
          />
        )}
      </AnimatePresence>
    </>
  );
}
