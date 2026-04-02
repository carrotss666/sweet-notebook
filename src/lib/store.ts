// Data types and localStorage helpers for 恋恋笔记本

export interface Memory {
  id: string;
  date: string;
  activity: string;
  emoji: string;
  note: string;
  photo?: string; // base64
}

export interface ChecklistItem {
  id: string;
  emoji: string;
  title: string;
  rating: number; // 1-5
}

const MEMORIES_KEY = "love-notebook-memories";
const CHECKLIST_KEY = "love-notebook-checklist";

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

export function getChecklist(): ChecklistItem[] {
  try {
    const items = JSON.parse(localStorage.getItem(CHECKLIST_KEY) || "null");
    if (items) return items;
  } catch {}
  // Default items
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

export function removeChecklistItem(id: string) {
  const all = getChecklist().filter((i) => i.id !== id);
  saveChecklist(all);
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// Predefined activities for random / recommend
export const ACTIVITIES = [
  { emoji: "🍜", title: "去没吃过的餐厅", quote: "可能会踩雷，也可能惊喜" },
  { emoji: "🚶", title: "随机坐一站地铁再散步", quote: "走到哪算哪" },
  { emoji: "📸", title: "互相给对方拍照", quote: "用你的视角看我" },
  { emoji: "🎬", title: "看一部老电影", quote: "经典永远不会过时" },
  { emoji: "🧁", title: "一起做甜点", quote: "甜甜蜜蜜" },
  { emoji: "🌃", title: "去看夜景", quote: "城市的灯光都是为我们亮的" },
  { emoji: "🎨", title: "一起画画", quote: "画得丑也没关系" },
  { emoji: "🎲", title: "玩桌游", quote: "输了的人请客" },
  { emoji: "☕", title: "找一家没去过的咖啡店", quote: "探索新角落" },
  { emoji: "🎵", title: "一起听歌散步", quote: "共享一副耳机" },
  { emoji: "🛒", title: "逛超市买零食", quote: "各自选三样" },
  { emoji: "📖", title: "去书店各选一本书", quote: "交换阅读" },
  { emoji: "🍳", title: "各自给对方点餐", quote: "看看你多了解我" },
  { emoji: "🏃", title: "一起去跑步", quote: "流汗也浪漫" },
  { emoji: "🌸", title: "去公园野餐", quote: "带上毯子和零食" },
];

export function getRandomActivity() {
  return ACTIVITIES[Math.floor(Math.random() * ACTIVITIES.length)];
}

export type MoodTag = "轻松" | "无聊" | "疲惫";
export type TimeTag = "工作日" | "周末" | "晚上";
export type WeatherTag = "晴天" | "雨天" | "随意";

interface RecommendFilter {
  mood: MoodTag;
  time: TimeTag;
  weather: WeatherTag;
}

const tagMap: Record<string, string[]> = {
  轻松: ["散步", "咖啡", "公园", "听歌", "书店"],
  无聊: ["桌游", "餐厅", "超市", "甜点", "画画"],
  疲惫: ["电影", "夜景", "听歌", "零食"],
  工作日: ["咖啡", "散步", "听歌", "零食"],
  周末: ["餐厅", "野餐", "画画", "桌游", "书店"],
  晚上: ["夜景", "电影", "散步", "听歌"],
  晴天: ["散步", "野餐", "公园", "跑步", "拍照"],
  雨天: ["电影", "咖啡", "甜点", "桌游", "书店"],
  随意: [],
};

export function getRecommendations(filter: RecommendFilter) {
  const keywords = [
    ...tagMap[filter.mood],
    ...tagMap[filter.time],
    ...tagMap[filter.weather],
  ];
  const scored = ACTIVITIES.map((a) => ({
    ...a,
    score: keywords.filter((k) => a.title.includes(k) || a.quote.includes(k)).length + Math.random() * 0.5,
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 3);
}
