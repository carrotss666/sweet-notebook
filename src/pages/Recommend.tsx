import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import BackButton from "@/components/BackButton";
import type { MoodTag, TimeTag, WeatherTag, EnergyTag } from "@/lib/recommend";

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

const energyLabels: Record<EnergyTag, string> = {
  low: "😴 不想动",
  medium: "🙂 正常",
  high: "🏃 想出去",
};

export default function Recommend() {
  const navigate = useNavigate();
  const [mood, setMood] = useState<MoodTag | null>(null);
  const [time, setTime] = useState<TimeTag | null>(null);
  const [weather, setWeather] = useState<WeatherTag | null>(null);
  const [energy, setEnergy] = useState<EnergyTag | null>(null);

  const canSubmit = mood && time && weather && energy;

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
          options={["轻松", "无聊", "疲惫", "开心", "低落", "兴奋"] as MoodTag[]}
          selected={mood}
          onSelect={(v) => setMood(v as MoodTag)}
        />
        <TagGroup
          label="时间"
          icon="⏰"
          options={["工作日", "周末", "晚上", "下午"] as TimeTag[]}
          selected={time}
          onSelect={(v) => setTime(v as TimeTag)}
        />
        <TagGroup
          label="天气"
          icon="🌤"
          options={["晴天", "雨天", "随意"] as WeatherTag[]}
          selected={weather}
          onSelect={(v) => setWeather(v as WeatherTag)}
        />

        <div className="mb-5">
          <p className="text-sm font-medium mb-2">⚡ 行动力</p>
          <div className="flex gap-2 flex-wrap">
            {(["low", "medium", "high"] as EnergyTag[]).map((e) => (
              <button
                key={e}
                onClick={() => setEnergy(e)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  energy === e
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "bg-secondary text-secondary-foreground hover:bg-love-blush"
                }`}
              >
                {energyLabels[e]}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      <button
        disabled={!canSubmit}
        onClick={() =>
          navigate("/recommend-result", { state: { mood, time, weather, energy } })
        }
        className="mt-4 w-full bg-primary text-primary-foreground py-3 rounded-2xl font-semibold shadow-soft disabled:opacity-40 transition-all"
      >
        ✨ 生成推荐
      </button>
    </PageWrapper>
  );
}
