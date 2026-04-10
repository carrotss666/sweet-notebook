import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  images: string[]; // URLs
  initialIndex?: number;
  onClose: () => void;
}

export default function ImageLightbox({ images, initialIndex = 0, onClose }: Props) {
  const [index, setIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const startX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && index > 0) setIndex(index - 1);
      if (e.key === "ArrowRight" && index < images.length - 1) setIndex(index + 1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [index, images.length, onClose]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (scale > 1) return;
    startX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (scale > 1) return;
    const diff = e.changedTouches[0].clientX - startX.current;
    if (Math.abs(diff) > 60) {
      if (diff < 0 && index < images.length - 1) setIndex(index + 1);
      if (diff > 0 && index > 0) setIndex(index - 1);
    }
  };

  const toggleZoom = () => {
    setScale(scale === 1 ? 2.5 : 1);
  };

  const handleDownload = async () => {
    try {
      const res = await fetch(images[index]);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `memory-${Date.now()}.jpg`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      window.open(images[index], "_blank");
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/95 flex flex-col"
        ref={containerRef}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 text-white/80 shrink-0">
          <button onClick={onClose} className="text-lg">✕</button>
          <span className="text-sm">{index + 1} / {images.length}</span>
          <button onClick={handleDownload} className="text-sm">💾 保存</button>
        </div>

        {/* Image area */}
        <div
          className="flex-1 flex items-center justify-center overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <motion.img
            key={index}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            src={images[index]}
            alt=""
            onClick={toggleZoom}
            className="max-w-full max-h-full object-contain transition-transform duration-200 select-none"
            style={{ transform: `scale(${scale})` }}
            draggable={false}
          />
        </div>

        {/* Bottom dots */}
        {images.length > 1 && (
          <div className="flex justify-center gap-1.5 pb-6 pt-2 shrink-0">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => { setIndex(i); setScale(1); }}
                className={`w-2 h-2 rounded-full transition-all ${i === index ? "bg-white w-4" : "bg-white/40"}`}
              />
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
