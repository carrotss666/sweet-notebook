import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import BackButton from "@/components/BackButton";
import { getRecommendations, type MoodTag, type TimeTag, type WeatherTag } from "@/lib/store";

export default function RecommendResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { mood, time, weather } = (location.state as {
    mood: MoodTag;
    time: TimeTag;
    weather: WeatherTag;
  }) || { mood: "轻松", time: "周末", weather: "随意" };

  const [results, setResults] = useState(() =>
    getRecommendations({ mood, time, weather })
  );
  const [key, setKey] = useState(0);

  const refresh = () => {
    setResults(getRecommendations({ mood, time, weather }));
    setKey((k) => k + 1);
  };

  return (
    <PageWrapper>
      <BackButton />
      <div className="mb-4">
        <h2 className="text-lg font-bold">💡 为你推荐</h2>
        <p className="text-xs text-muted-foreground mt-1">
          （{mood} / {time} / {weather}）
        </p>
      </div>

      <motion.div key={key} className="space-y-3">
        {results.map((item, i) => (
          <motion.div
            key={item.title + i}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="love-card"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{item.emoji}</span>
              <div className="flex-1">
                <p className="font-semibold text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground italic mt-0.5">
                  "{item.quote}"
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3">
              <div className="flex gap-2 text-lg">
                <button className="hover:scale-125 transition-transform">👍</button>
                <button className="hover:scale-125 transition-transform">👎</button>
              </div>
              <button
                onClick={() =>
                  navigate("/in-progress", {
                    state: { emoji: item.emoji, title: item.title },
                  })
                }
                className="text-sm bg-primary text-primary-foreground px-4 py-1.5 rounded-xl font-medium"
              >
                ❤️ 去做这个
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <button
        onClick={refresh}
        className="mt-4 w-full text-center text-primary font-medium text-sm"
      >
        🎲 换一批推荐
      </button>
    </PageWrapper>
  );
}
