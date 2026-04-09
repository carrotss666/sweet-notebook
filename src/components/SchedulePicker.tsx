import { useState } from "react";

interface Props {
  value: string | undefined;
  onChange: (v: string | undefined) => void;
}

const presets = [
  { label: "尽快", value: undefined },
  { label: "今天", value: "today" },
  { label: "周末", value: "weekend" },
] as const;

export default function SchedulePicker({ value, onChange }: Props) {
  const [showCustom, setShowCustom] = useState(false);

  const isPreset = value === undefined || value === "today" || value === "weekend";

  return (
    <div>
      <p className="text-xs text-muted-foreground mb-2">⏰ 什么时候去？</p>
      <div className="flex gap-2 flex-wrap">
        {presets.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => {
              onChange(p.value);
              setShowCustom(false);
            }}
            className={`text-xs px-3 py-1.5 rounded-xl transition-all ${
              (isPreset && value === p.value)
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            {p.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => {
            setShowCustom(true);
            onChange(new Date().toISOString().slice(0, 10));
          }}
          className={`text-xs px-3 py-1.5 rounded-xl transition-all ${
            !isPreset
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground"
          }`}
        >
          自定义
        </button>
      </div>
      {showCustom && !isPreset && (
        <input
          type="date"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="mt-2 w-full bg-secondary text-foreground rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      )}
    </div>
  );
}
