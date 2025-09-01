import { useState, useEffect, useCallback } from "react";
import { useTimer } from "@/hooks/useTimer";
import type { Mode } from "@/types";


export const usePomodoroController = (
  workTime: number,
  shortBreak: number,
  longBreak: number,
) => {
  const getDurationFor = (m: Mode) =>
    m === "work" ? workTime * 60 : m === "shortBreak" ? shortBreak * 60 : longBreak * 60;

  const [mode, setMode] = useState<Mode>("work");
  const [finished, setFinished] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { time: timeInSeconds, start, pause, reset: resetTimer, isRunning } =
    useTimer(getDurationFor(mode));

  useEffect(() => {
    if (timeInSeconds === 0) {
      pause();
      setFinished(true);
    }
  }, [timeInSeconds, pause]);

  const switchTo = (m: Mode) => {
    setMode(m);
    setFinished(false);
    resetTimer();
  };

  const enterFullscreen = async () => {
    if (document.documentElement.requestFullscreen) {
      try { await document.documentElement.requestFullscreen(); } catch {}
    }
    setIsFullscreen(true);
  };

  const exitFullscreen = useCallback(() => {
    setIsFullscreen(false);
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  return {
    // state
    mode, setMode, finished, setFinished, isFullscreen,
    timeInSeconds, isRunning,
    // actions
    start, pause, resetTimer, switchTo, enterFullscreen, exitFullscreen,
  };
};
