import { Button } from "@/components/ui/button";
import TimerDisplay from "./TimerDisplay";

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
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{
        backgroundImage: `url(${bgImage || ""})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex-1 flex items-center justify-center">
        <div className="text-white text-7xl font-extrabold drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
          <TimerDisplay seconds={seconds} />
        </div>
      </div>

      {finished && (
        <div className="w-full flex items-center justify-center gap-3 pb-3">
          <Button variant="outline" onClick={() => onSelectMode("work")}  className="bg-black/40 hover:bg-black/60 text-white border-white/40 rounded-full">
            Work ({workTime} min)
          </Button>
          <Button variant="outline" onClick={() => onSelectMode("shortBreak")} className="bg-black/40 hover:bg-black/60 text-white border-white/40 rounded-full">
            Short Break ({shortBreak} min)
          </Button>
          <Button variant="outline" onClick={() => onSelectMode("longBreak")}  className="bg-black/40 hover:bg-black/60 text-white border-white/40 rounded-full">
            Long Break ({longBreak} min)
          </Button>
        </div>
      )}

      <div className="w-full flex items-center justify-center gap-4 pb-8">
        <Button onClick={onStopOrResume} className="bg-black/60 hover:bg-black/70 text-white px-8 py-3 rounded-full text-lg font-semibold backdrop-blur">
          {isRunning ? "Stop" : finished ? "Start Selected" : "Resume"}
        </Button>
        <Button variant="outline" onClick={onReset} className="bg-black/40 hover:bg-black/50 text-white border-white/40 px-8 py-3 rounded-full text-lg font-semibold backdrop-blur">
          Reset
        </Button>
        <Button variant="outline" onClick={onExit} className="bg-black/30 hover:bg-black/40 text-white border-white/30 px-8 py-3 rounded-full text-lg font-semibold backdrop-blur">
          Exit
        </Button>
      </div>
    </div>
  );
}
