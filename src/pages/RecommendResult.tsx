import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import BackButton from "@/components/BackButton";
import {
  getSmartRecommendations,
  likeActivity,
  dislikeActivity,
  addToHistory,
  type MoodTag,
  type TimeTag,
  type WeatherTag,
  type EnergyTag,
} from "@/lib/recommend";
import type { Activity } from "@/lib/activities";
import { addTask } from "@/lib/cloudStore";
import SchedulePicker from "@/components/SchedulePicker";

export default function RecommendResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { mood, time, weather, energy } = (location.state as {
    mood: MoodTag;
    time: TimeTag;
    weather: WeatherTag;
    energy: EnergyTag;
  }) || { mood: "轻松", time: "周末", weather: "随意", energy: "medium" };

  const ctx = { mood, time, weather, energy };

  const [results, setResults] = useState<Activity[]>(() => getSmartRecommendations(ctx));
  const [key, setKey] = useState(0);
  const [feedback, setFeedback] = useState<Record<number, "like" | "dislike">>({});
  const [starting, setStarting] = useState<number | null>(null);
  const [schedules, setSchedules] = useState<Record<number, string | undefined>>({});

  const refresh = () => {
    setResults(getSmartRecommendations(ctx));
    setKey((k) => k + 1);
    setFeedback({});
    setSchedules({});
  };

  const handleLike = (item: Activity) => {
    likeActivity(item);
    setFeedback((f) => ({ ...f, [item.id]: "like" }));
  };

  const handleDislike = (item: Activity) => {
    dislikeActivity(item);
    setFeedback((f) => ({ ...f, [item.id]: "dislike" }));
  };

  const startDate = async (item: Activity) => {
    if (starting !== null) return;
    setStarting(item.id);
    addToHistory(item.title);
    await addTask({
      emoji: item.emoji,
      title: item.title,
      source: "recommend",
      scheduledAt: schedules[item.id],
    });
    navigate("/");
  };

  return (
    <PageWrapper>
      <BackButton />
      <div className="mb-4">
        <h2 className="text-lg font-bold">💡 为你推荐</h2>
        <p className="text-xs text-muted-foreground mt-1">
          （{mood} / {time} / {weather} / {energy === "low" ? "不想动" : energy === "high" ? "想出去" : "正常"}）
        </p>
      </div>

      <motion.div key={key} className="space-y-3">
        {results.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="love-card"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{item.emoji}</span>
              <div className="flex-1">
                <p className="font-semibold text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground italic mt-0.5">"{item.lines[0]}"</p>
                <div className="flex gap-1 mt-1 flex-wrap">
                  {item.tags.map((tag) => (
                    <span key={tag} className="text-[10px] bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-3">
              <SchedulePicker
                value={schedules[item.id]}
                onChange={(v) => setSchedules((s) => ({ ...s, [item.id]: v }))}
              />
            </div>
            <div className="flex items-center justify-between mt-3">
              <div className="flex gap-2 text-lg">
                <button
                  onClick={() => handleLike(item)}
                  className={`hover:scale-125 transition-transform ${feedback[item.id] === "like" ? "scale-125" : ""}`}
                >
                  👍
                </button>
                <button
                  onClick={() => handleDislike(item)}
                  className={`hover:scale-125 transition-transform ${feedback[item.id] === "dislike" ? "scale-125" : ""}`}
                >
                  👎
                </button>
              </div>
              <button
                onClick={() => startDate(item)}
                disabled={starting !== null}
                className="text-sm bg-primary text-primary-foreground px-4 py-1.5 rounded-xl font-medium disabled:opacity-60"
              >
                📋 加入待办
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <button onClick={refresh} className="mt-4 w-full text-center text-primary font-medium text-sm">
        🎲 换一批推荐
      </button>
    </PageWrapper>
  );
}
