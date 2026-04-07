// Smart recommendation engine for 恋恋笔记本
import { ACTIVITIES_V2, type Activity } from "./activities";

const PROFILE_KEY = "love-notebook-profile";
const HISTORY_KEY = "love-notebook-history";

export type MoodTag = "轻松" | "无聊" | "疲惫" | "开心" | "低落" | "兴奋";
export type TimeTag = "工作日" | "周末" | "晚上" | "下午";
export type WeatherTag = "晴天" | "雨天" | "随意";
export type EnergyTag = "low" | "medium" | "high";

export interface UserProfile {
  preferredTags: string[];   // learned from likes
  dislikedTags: string[];    // learned from dislikes
}

export interface RecommendContext {
  mood: MoodTag;
  time: TimeTag;
  weather: WeatherTag;
  energy: EnergyTag;
}

function getProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : { preferredTags: [], dislikedTags: [] };
  } catch {
    return { preferredTags: [], dislikedTags: [] };
  }
}

function saveProfile(p: UserProfile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
}

function getHistory(): string[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
}

export function addToHistory(title: string) {
  const h = getHistory();
  if (!h.includes(title)) {
    h.push(title);
    // keep last 50
    if (h.length > 50) h.shift();
    localStorage.setItem(HISTORY_KEY, JSON.stringify(h));
  }
}

export function likeActivity(activity: Activity) {
  const profile = getProfile();
  activity.tags.forEach(t => {
    if (!profile.preferredTags.includes(t)) {
      profile.preferredTags.push(t);
    }
    // remove from disliked if present
    profile.dislikedTags = profile.dislikedTags.filter(d => d !== t);
  });
  saveProfile(profile);
}

export function dislikeActivity(activity: Activity) {
  const profile = getProfile();
  activity.tags.forEach(t => {
    if (!profile.dislikedTags.includes(t)) {
      profile.dislikedTags.push(t);
    }
    // remove from preferred if present
    profile.preferredTags = profile.preferredTags.filter(p => p !== t);
  });
  saveProfile(profile);
}

function scoreActivity(a: Activity, ctx: RecommendContext, profile: UserProfile, history: string[]): number {
  let score = 0;

  // ① Mood match (most important)
  if (a.mood.includes(ctx.mood)) score += 5;

  // ② Energy match
  if (a.energy === ctx.energy) score += 4;
  // adjacent energy levels get partial score
  const energyOrder = ["low", "medium", "high"];
  const diff = Math.abs(energyOrder.indexOf(a.energy) - energyOrder.indexOf(ctx.energy));
  if (diff === 1) score += 2;

  // ③ Time match
  if (a.time.includes(ctx.time)) score += 3;

  // ④ Weather match
  if (a.weather.includes(ctx.weather) || a.weather.includes("随意") || ctx.weather === "随意") score += 2;

  // ⑤ User preference (learned)
  a.tags.forEach(t => {
    if (profile.preferredTags.includes(t)) score += 3;
    if (profile.dislikedTags.includes(t)) score -= 3;
  });

  // ⑥ History dedup
  if (history.includes(a.title)) score -= 5;

  // ⑦ Small random factor for variety
  score += Math.random() * 1.5;

  return score;
}

export function getSmartRecommendations(ctx: RecommendContext, count = 3): Activity[] {
  const profile = getProfile();
  const history = getHistory();

  const scored = ACTIVITIES_V2.map(a => ({
    activity: a,
    score: scoreActivity(a, ctx, profile, history),
  }));

  scored.sort((a, b) => b.score - a.score);

  // Pick from top pool with some randomness
  const poolSize = Math.min(count * 3, scored.length);
  const pool = scored.slice(0, poolSize);

  const picked: Activity[] = [];
  const used = new Set<number>();

  while (picked.length < count && pool.length > 0) {
    const idx = Math.floor(Math.random() * Math.min(pool.length, poolSize));
    if (!used.has(pool[idx].activity.id)) {
      used.add(pool[idx].activity.id);
      picked.push(pool[idx].activity);
    }
    pool.splice(idx, 1);
  }

  return picked;
}

// For random pick feature — just pick one random from all
export function getRandomActivity(): Activity {
  return ACTIVITIES_V2[Math.floor(Math.random() * ACTIVITIES_V2.length)];
}
