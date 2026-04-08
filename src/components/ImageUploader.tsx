import { useState, useRef } from "react";

interface ImageItem {
  fileID?: string; // existing cloud fileID
  file?: File;     // new local file
  preview: string; // display URL
}

interface Props {
  images: ImageItem[];
  onChange: (images: ImageItem[]) => void;
  max?: number;
}

export type { ImageItem };

export default function ImageUploader({ images, onChange, max = 9 }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const replaceRef = useRef<HTMLInputElement>(null);
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null);

  const handleAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newItems: ImageItem[] = [];
    const remaining = max - images.length;
    for (let i = 0; i < Math.min(files.length, remaining); i++) {
      newItems.push({
        file: files[i],
        preview: URL.createObjectURL(files[i]),
      });
    }
    onChange([...images, ...newItems]);
    e.target.value = "";
  };

  const handleRemove = (index: number) => {
    const updated = [...images];
    // Revoke blob URL if it's a local preview
    if (updated[index].file) {
      URL.revokeObjectURL(updated[index].preview);
    }
    updated.splice(index, 1);
    onChange(updated);
  };

  const handleReplace = (index: number) => {
    setReplaceIndex(index);
    replaceRef.current?.click();
  };

  const handleReplaceFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || replaceIndex === null) return;
    const updated = [...images];
    if (updated[replaceIndex].file) {
      URL.revokeObjectURL(updated[replaceIndex].preview);
    }
    updated[replaceIndex] = {
      file,
      preview: URL.createObjectURL(file),
    };
    onChange(updated);
    setReplaceIndex(null);
    e.target.value = "";
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {images.map((img, i) => (
          <div key={i} className="relative w-20 h-20 group">
            <img
              src={img.preview}
              alt=""
              className="w-full h-full object-cover rounded-xl cursor-pointer"
              onClick={() => handleReplace(i)}
            />
            <button
              onClick={(e) => { e.stopPropagation(); handleRemove(i); }}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-destructive text-destructive-foreground rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ✕
            </button>
            <span className="absolute bottom-0.5 right-0.5 text-[9px] bg-foreground/50 text-background px-1 rounded opacity-0 group-hover:opacity-100">
              替换
            </span>
          </div>
        ))}
      </div>

      {images.length < max && (
        <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
          📸 + 添加照片（可多选）
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleAdd}
          />
        </label>
      )}

      {/* Hidden input for replacing */}
      <input
        ref={replaceRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleReplaceFile}
      />
    </div>
  );
}
