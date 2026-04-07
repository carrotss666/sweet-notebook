// Data types and localStorage helpers for 恋恋笔记本

export interface Memory {
  id: string;
  date: string; // YYYY.MM.DD
  activity: string;
  emoji: string;
  note: string;
  photo?: string; // base64
  mood?: string; // emoji mood
}

export interface ChecklistItem {
  id: string;
  emoji: string;
  title: string;
  rating: number; // 1-5
}

export interface PendingActivity {
  emoji: string;
  title: string;
  startedAt: string; // ISO
}

const MEMORIES_KEY = "love-notebook-memories";
const CHECKLIST_KEY = "love-notebook-checklist";
const PENDING_KEY = "love-notebook-pending";

// --- Pending Activity ---
export function getPending(): PendingActivity | null {
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setPending(p: PendingActivity) {
  localStorage.setItem(PENDING_KEY, JSON.stringify(p));
}

export function clearPending() {
  localStorage.removeItem(PENDING_KEY);
}

// --- Memories ---
export function getMemories(): Memory[] {
  try {
    return JSON.parse(localStorage.getItem(MEMORIES_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveMemory(m: Memory) {
  const all = getMemories();
  all.unshift(m);
  localStorage.setItem(MEMORIES_KEY, JSON.stringify(all));
}

export function updateMemory(updated: Memory) {
  const all = getMemories().map((m) => (m.id === updated.id ? updated : m));
  localStorage.setItem(MEMORIES_KEY, JSON.stringify(all));
}

export function deleteMemory(id: string) {
  const all = getMemories().filter((m) => m.id !== id);
  localStorage.setItem(MEMORIES_KEY, JSON.stringify(all));
}

// --- Checklist ---
export function getChecklist(): ChecklistItem[] {
  try {
    const items = JSON.parse(localStorage.getItem(CHECKLIST_KEY) || "null");
    if (items) return items;
  } catch {}
  const defaults: ChecklistItem[] = [
    { id: "1", emoji: "🍜", title: "去没吃过的店", rating: 4 },
    { id: "2", emoji: "🚶", title: "随机散步", rating: 3 },
    { id: "3", emoji: "📸", title: "给对方拍照", rating: 5 },
    { id: "4", emoji: "🎬", title: "看一部老电影", rating: 2 },
    { id: "5", emoji: "🧁", title: "一起做甜点", rating: 4 },
    { id: "6", emoji: "🌃", title: "看夜景", rating: 3 },
  ];
  localStorage.setItem(CHECKLIST_KEY, JSON.stringify(defaults));
  return defaults;
}

export function saveChecklist(items: ChecklistItem[]) {
  localStorage.setItem(CHECKLIST_KEY, JSON.stringify(items));
}

export function addChecklistItem(item: ChecklistItem) {
  const all = getChecklist();
  all.push(item);
  saveChecklist(all);
}

export function updateChecklistItem(updated: ChecklistItem) {
  const all = getChecklist().map((i) => (i.id === updated.id ? updated : i));
  saveChecklist(all);
}

export function removeChecklistItem(id: string) {
  const all = getChecklist().filter((i) => i.id !== id);
  saveChecklist(all);
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// Re-export from new modules for backward compat
export { getRandomActivity } from "./recommend";
export type { MoodTag, TimeTag, WeatherTag } from "./recommend";

