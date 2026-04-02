import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import BackButton from "@/components/BackButton";
import type { MoodTag, TimeTag, WeatherTag } from "@/lib/store";

function TagGroup<T extends string>({
  label,
  icon,
  options,
  selected,
  onSelect,
}: {
  label: string;
  icon: string;
  options: T[];
  selected: T | null;
  onSelect: (v: T) => void;
}) {
  return (
    <div className="mb-5">
      <p className="text-sm font-medium mb-2">
        {icon} {label}
      </p>
      <div className="flex gap-2 flex-wrap">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onSelect(opt)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selected === opt
                ? "bg-primary text-primary-foreground shadow-soft"
                : "bg-secondary text-secondary-foreground hover:bg-love-blush"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Recommend() {
  const navigate = useNavigate();
  const [mood, setMood] = useState<MoodTag | null>(null);
  const [time, setTime] = useState<TimeTag | null>(null);
  const [weather, setWeather] = useState<WeatherTag | null>(null);

  const canSubmit = mood && time && weather;

  return (
    <PageWrapper>
      <BackButton />
      <div className="text-center mb-6">
        <p className="text-lg text-muted-foreground">今天的你是？💭</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <TagGroup
          label="心情"
          icon="😊"
          options={["轻松", "无聊", "疲惫"] as MoodTag[]}
          selected={mood}
          onSelect={setMood}
        />
        <TagGroup
          label="时间"
          icon="⏰"
          options={["工作日", "周末", "晚上"] as TimeTag[]}
          selected={time}
          onSelect={setTime}
        />
        <TagGroup
          label="天气"
          icon="🌤"
          options={["晴天", "雨天", "随意"] as WeatherTag[]}
          selected={weather}
          onSelect={setWeather}
        />
      </motion.div>

      <button
        disabled={!canSubmit}
        onClick={() =>
          navigate("/recommend-result", { state: { mood, time, weather } })
        }
        className="mt-4 w-full bg-primary text-primary-foreground py-3 rounded-2xl font-semibold shadow-soft disabled:opacity-40 transition-all"
      >
        ✨ 生成推荐
      </button>
    </PageWrapper>
  );
}
