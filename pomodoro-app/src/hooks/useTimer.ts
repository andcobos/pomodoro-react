import { useState, useEffect } from "react";

interface UseTimerReturn {
  time: number;
  start: () => void;
  pause: () => void;
  reset: () => void;
  isRunning: boolean;
}

export const useTimer = (initialTime: number = 1500): UseTimerReturn => {
  const [time, setTime] = useState<number>(initialTime);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    setTime(initialTime);
  }, [initialTime]);

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = () => {
    setIsRunning(false);
    setTime(initialTime);
  };

  return { time, start, pause, reset, isRunning };
};
