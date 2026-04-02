import { useLocation, useNavigate } from "react-router-dom";

const tabs = [
  { path: "/", icon: "🏠", label: "首页" },
  { path: "/checklist", icon: "📋", label: "清单" },
  { path: "/memories", icon: "💕", label: "回忆" },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-md border-t border-border">
      <div className="max-w-md mx-auto flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const active = location.pathname === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center gap-0.5 px-6 py-2 rounded-xl transition-all duration-200 ${
                active
                  ? "text-primary scale-105"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="text-xs font-medium">{tab.label}</span>
              {active && (
                <span className="w-1 h-1 rounded-full bg-primary mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
