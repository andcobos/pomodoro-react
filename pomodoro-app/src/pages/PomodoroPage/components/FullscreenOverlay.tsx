import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import TimerDisplay from "./TimerDisplay";

// Mapa de clases seguras de Tailwind (para evitar purge)
const fontMap: Record<string, string> = {
  bitter: "font-bitter",
  cinzel: "font-cinzel",
  blackops: "font-blackops",
  edunsw: "font-edunsw",
};

export default function FullscreenOverlay({
  bgImage,
  seconds,
  isRunning,
  finished,
  workTime,
  shortBreak,
  longBreak,
  onStopOrResume,
  onReset,
  onExit,
  onSelectMode,
  fontFamily, // 👈 nuevo prop
}: {
  bgImage: string | null;
  seconds: number;
  isRunning: boolean;
  finished: boolean;
  workTime: number;
  shortBreak: number;
  longBreak: number;
  onStopOrResume: () => void;
  onReset: () => void;
  onExit: () => void;
  onSelectMode: (m: "work" | "shortBreak" | "longBreak") => void;
  fontFamily: string;
}) {
  // ---- Real-time clock state ----
  const [showRealTime, setShowRealTime] = useState(false);
  const [now, setNow] = useState<string>("");

  // Format HH:mm:ss (24h)
  const formatNow = () => {
    const d = new Date();
    const hh = d.getHours().toString().padStart(2, "0");
    const mm = d.getMinutes().toString().padStart(2, "0");
    const ss = d.getSeconds().toString().padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
  };

  useEffect(() => {
    if (!showRealTime) return;
    setNow(formatNow());
    const id = setInterval(() => setNow(formatNow()), 1000);
    return () => clearInterval(id);
  }, [showRealTime]);

  // 👇 asigna la clase de fuente según la selección
  const fontClass = fontMap[fontFamily] ?? "font-bitter";

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{
        backgroundImage: `url(${bgImage || ""})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Real time badge (top-right) */}
      {showRealTime && (
        <div className="absolute top-6 right-6 bg-black/50 text-white px-4 py-2 rounded-full text-lg font-semibold backdrop-blur-sm">
          {now}
        </div>
      )}

      {/* Centered countdown */}
      <div className="flex-1 flex items-center justify-center">
        <div
          className={`text-white text-9xl font-extrabold drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] ${fontClass}`}
        >
          <TimerDisplay seconds={seconds} />
        </div>
      </div>

      {/* Mode chooser when finished */}
      {finished && (
        <div className="w-full flex items-center justify-center gap-3 pb-3">
          <Button variant="overlay" onClick={() => onSelectMode("work")} className="px-8 py-3 rounded-full text-lg font-semibold backdrop-blur">
            Work ({workTime} min)
          </Button>
          <Button variant="overlay" onClick={() => onSelectMode("shortBreak")} className="px-8 py-3 rounded-full text-lg font-semibold backdrop-blur">
            Short Break ({shortBreak} min)
          </Button>
          <Button variant="overlay" onClick={() => onSelectMode("longBreak")} className="px-8 py-3 rounded-full text-lg font-semibold backdrop-blur">
            Long Break ({longBreak} min)
          </Button>
        </div>
      )}

      {/* Controls row */}
      <div className="w-full flex items-center justify-center gap-4 pb-8">
        <Button
          onClick={onStopOrResume}
          className="bg-black/60 hover:bg-black/70 text-white px-8 py-3 rounded-full text-lg font-semibold backdrop-blur"
        >
          {isRunning ? "Stop" : finished ? "Start Selected" : "Resume"}
        </Button>

        <Button variant="overlay" onClick={onReset} className="px-8 py-3 rounded-full text-lg font-semibold backdrop-blur">
          Reset
        </Button>

        <Button variant="overlay" onClick={() => setShowRealTime((v) => !v)} className="px-8 py-3 rounded-full text-lg font-semibold backdrop-blur">
          {showRealTime ? "Hide Real Time" : "Show Real Time"}
        </Button>

        <Button variant="overlay" onClick={onExit} className="px-8 py-3 rounded-full text-lg font-semibold backdrop-blur">
          Exit
        </Button>
      </div>
    </div>
  );
}
