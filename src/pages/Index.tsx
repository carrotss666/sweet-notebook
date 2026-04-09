import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import BottomNav from "@/components/BottomNav";
import RecordDialog from "@/components/RecordDialog";
import { getTasks, updateTaskStatus, deleteTask, type CloudTask } from "@/lib/cloudStore";

const actions = [
  {
    emoji: "🎰",
    title: "抽一个",
    desc: "随机决定，不用纠结",
    path: "/random",
  },
  {
    emoji: "✨",
    title: "看看推荐",
    desc: "按心情帮你选",
    path: "/recommend",
  },
  {
    emoji: "✍️",
    title: "自己决定",
    desc: "已经有想法了",
    path: "/custom",
  },
];

function formatSchedule(s?: string): string {
  if (!s) return "尽快";
  if (s === "today") return "今天";
  if (s === "weekend") return "周末";
  return s;
}

const MAX_VISIBLE = 3;

export default function Index() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<CloudTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [recordTask, setRecordTask] = useState<CloudTask | null>(null);

  useEffect(() => {
    getTasks().then((t) => {
      setTasks(t);
      setLoading(false);
    });
  }, []);

  const pendingTasks = tasks.filter((t) => t.status === "pending");
  const visibleTasks = expanded ? pendingTasks : pendingTasks.slice(0, MAX_VISIBLE);
  const hiddenCount = pendingTasks.length - MAX_VISIBLE;

  const handleDone = async (task: CloudTask) => {
    await updateTaskStatus(task._id!, "done");
    setTasks((prev) => prev.map((t) => (t._id === task._id ? { ...t, status: "done" } : t)));
  };

  const handleDelete = async (task: CloudTask) => {
    await deleteTask(task._id!);
    setTasks((prev) => prev.filter((t) => t._id !== task._id));
  };

  return (
    <>
      <PageWrapper>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-bold tracking-tight">
            恋恋笔记本 <span className="text-primary">❤️</span>
          </h1>
          <p className="text-muted-foreground mt-3 text-base">
            今天要做什么？🎯
          </p>
        </motion.div>

        {/* Tasks List */}
        {!loading && pendingTasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <p className="text-sm font-semibold text-primary mb-2">📋 待办事项（{pendingTasks.length}）</p>
            <div className="space-y-2">
              {visibleTasks.map((task) => (
                <div
                  key={task._id}
                  className="love-card flex items-center gap-3 border border-border/50"
                >
                  <span className="text-xl">{task.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{task.title}</p>
                    <p className="text-[11px] text-muted-foreground">
                      ⏰ {formatSchedule(task.scheduledAt)}
                      {task.source === "random" && " · 🎰 随机"}
                      {task.source === "recommend" && " · ✨ 推荐"}
                      {task.source === "manual" && " · ✍️ 手动"}
                    </p>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <button
                      onClick={() => setRecordTask(task)}
                      className="text-xs bg-primary text-primary-foreground px-2.5 py-1 rounded-lg"
                    >
                      记录
                    </button>
                    <button
                      onClick={() => handleDone(task)}
                      className="text-xs bg-secondary text-secondary-foreground px-2.5 py-1 rounded-lg"
                    >
                      ✅
                    </button>
                    <button
                      onClick={() => handleDelete(task)}
                      className="text-xs text-muted-foreground px-1.5 py-1"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {hiddenCount > 0 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-2 w-full text-center text-xs text-primary font-medium"
              >
                {expanded ? "收起" : `还有 ${hiddenCount} 条待办 ▾`}
              </button>
            )}
          </motion.div>
        )}

        <div className="space-y-4">
          {actions.map((action, i) => (
            <motion.button
              key={action.path}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.1, duration: 0.4 }}
              onClick={() => navigate(action.path)}
              className="love-card-interactive w-full text-left flex items-center gap-4"
            >
              <span className="text-3xl">{action.emoji}</span>
              <div className="flex-1">
                <div className="font-semibold text-base">{action.title}</div>
                <div className="text-sm text-muted-foreground mt-0.5">
                  {action.desc}
                </div>
              </div>
              <span className="text-muted-foreground text-lg">→</span>
            </motion.button>
          ))}
        </div>
      </PageWrapper>
      <BottomNav />

      {recordTask && (
        <RecordDialog
          activity={recordTask.title}
          emoji={recordTask.emoji}
          onClose={() => setRecordTask(null)}
          onSaved={async () => {
            await updateTaskStatus(recordTask._id!, "done");
            setTasks((prev) => prev.map((t) => (t._id === recordTask._id ? { ...t, status: "done" } : t)));
            setRecordTask(null);
          }}
        />
      )}
    </>
  );
}
