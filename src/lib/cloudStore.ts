// Cloud data layer - replaces localStorage operations with TCB
import { ensureAuth, getDb, getApp, getCoupleId } from "./tcb";

export interface CloudMemory {
  _id?: string;
  coupleId: string;
  date: string;
  activity: string;
  emoji: string;
  note: string;
  images: string[]; // fileID array
  mood?: string;
  createdAt: number;
}

export interface CloudChecklistItem {
  _id?: string;
  coupleId: string;
  emoji: string;
  title: string;
  rating: number;
  createdAt: number;
}

export interface CloudPending {
  _id?: string;
  coupleId: string;
  emoji: string;
  title: string;
  startedAt: string;
}

export interface CloudTask {
  _id?: string;
  coupleId: string;
  title: string;
  emoji: string;
  source: "random" | "recommend" | "manual";
  status: "pending" | "done";
  scheduledAt?: string; // "today" | "weekend" | ISO date | undefined (ASAP)
  createdAt: number;
}

// --- Image Operations ---

export async function uploadImages(files: File[]): Promise<string[]> {
  await ensureAuth();
  const app = getApp();
  const fileIDs: string[] = [];

  for (const file of files) {
    const cloudPath = `images/${getCoupleId()}/${Date.now()}-${Math.random().toString(36).slice(2, 6)}-${file.name}`;
    const res = await app.uploadFile({
      cloudPath,
      filePath: file as any,
    });
    fileIDs.push(res.fileID);
  }

  return fileIDs;
}

export async function getImageUrls(fileIDs: string[]): Promise<string[]> {
  if (!fileIDs || fileIDs.length === 0) return [];
  await ensureAuth();
  const app = getApp();
  const res = await app.getTempFileURL({ fileList: fileIDs });
  return res.fileList.map((f: any) => f.tempFileURL);
}

export async function deleteCloudFile(fileID: string): Promise<void> {
  await ensureAuth();
  const app = getApp();
  await app.deleteFile({ fileList: [fileID] });
}

// --- Memories ---

export async function getMemories(): Promise<CloudMemory[]> {
  await ensureAuth();
  const db = getDb();
  const coupleId = getCoupleId();
  const res = await db
    .collection("memories")
    .where({ coupleId })
    .orderBy("createdAt", "desc")
    .limit(1000)
    .get();
  return res.data as CloudMemory[];
}

export async function saveMemory(m: Omit<CloudMemory, "_id" | "coupleId" | "createdAt">): Promise<string> {
  await ensureAuth();
  const db = getDb();
  const coupleId = getCoupleId();
  const res = await db.collection("memories").add({
    ...m,
    coupleId,
    createdAt: Date.now(),
  });
  return res.id;
}

export async function updateMemory(id: string, data: Partial<CloudMemory>): Promise<void> {
  await ensureAuth();
  const db = getDb();
  const { _id, coupleId, ...rest } = data as any;
  await db.collection("memories").doc(id).update(rest);
}

export async function deleteMemory(id: string): Promise<void> {
  await ensureAuth();
  const db = getDb();
  await db.collection("memories").doc(id).remove();
}

// --- Checklist ---

export async function getChecklist(): Promise<CloudChecklistItem[]> {
  await ensureAuth();
  const db = getDb();
  const coupleId = getCoupleId();
  const res = await db
    .collection("checklist")
    .where({ coupleId })
    .orderBy("createdAt", "asc")
    .limit(1000)
    .get();

  // If empty, seed with defaults
  if (res.data.length === 0) {
    const defaults = [
      { emoji: "🍜", title: "去没吃过的店", rating: 4 },
      { emoji: "🚶", title: "随机散步", rating: 3 },
      { emoji: "📸", title: "给对方拍照", rating: 5 },
      { emoji: "🎬", title: "看一部老电影", rating: 2 },
      { emoji: "🧁", title: "一起做甜点", rating: 4 },
      { emoji: "🌃", title: "看夜景", rating: 3 },
    ];
    const items: CloudChecklistItem[] = [];
    for (const d of defaults) {
      const r = await db.collection("checklist").add({
        ...d,
        coupleId,
        createdAt: Date.now(),
      });
      items.push({ _id: r.id, ...d, coupleId, createdAt: Date.now() });
    }
    return items;
  }
  return res.data as CloudChecklistItem[];
}

export async function addChecklistItem(data: { emoji: string; title: string; rating: number }): Promise<string> {
  await ensureAuth();
  const db = getDb();
  const coupleId = getCoupleId();
  const res = await db.collection("checklist").add({
    ...data,
    coupleId,
    createdAt: Date.now(),
  });
  return res.id;
}

export async function updateChecklistItem(id: string, data: Partial<CloudChecklistItem>): Promise<void> {
  await ensureAuth();
  const db = getDb();
  const { _id, coupleId, ...rest } = data as any;
  await db.collection("checklist").doc(id).update(rest);
}

export async function removeChecklistItem(id: string): Promise<void> {
  await ensureAuth();
  const db = getDb();
  await db.collection("checklist").doc(id).remove();
}

// --- Pending Activity ---

export async function getPending(): Promise<CloudPending | null> {
  await ensureAuth();
  const db = getDb();
  const coupleId = getCoupleId();
  const res = await db
    .collection("pending")
    .where({ coupleId })
    .limit(1)
    .get();
  return (res.data[0] as CloudPending) || null;
}

export async function setPending(data: { emoji: string; title: string; startedAt: string }): Promise<void> {
  await ensureAuth();
  const db = getDb();
  const coupleId = getCoupleId();
  // Clear existing first
  await clearPending();
  await db.collection("pending").add({
    ...data,
    coupleId,
  });
}

export async function clearPending(): Promise<void> {
  await ensureAuth();
  const db = getDb();
  const coupleId = getCoupleId();
  const res = await db.collection("pending").where({ coupleId }).get();
  for (const doc of res.data) {
    await db.collection("pending").doc((doc as any)._id).remove();
  }
}

// --- Tasks ---

export async function getTasks(): Promise<CloudTask[]> {
  await ensureAuth();
  const db = getDb();
  const coupleId = getCoupleId();
  const res = await db
    .collection("tasks")
    .where({ coupleId })
    .orderBy("createdAt", "desc")
    .limit(100)
    .get();
  return res.data as CloudTask[];
}

export async function addTask(data: {
  title: string;
  emoji: string;
  source: "random" | "recommend" | "manual";
  scheduledAt?: string;
}): Promise<string> {
  await ensureAuth();
  const db = getDb();
  const coupleId = getCoupleId();
  const res = await db.collection("tasks").add({
    ...data,
    coupleId,
    status: "pending",
    createdAt: Date.now(),
  });
  return res.id;
}

export async function updateTaskStatus(id: string, status: "pending" | "done"): Promise<void> {
  await ensureAuth();
  const db = getDb();
  await db.collection("tasks").doc(id).update({ status });
}

export async function deleteTask(id: string): Promise<void> {
  await ensureAuth();
  const db = getDb();
  await db.collection("tasks").doc(id).remove();
}
