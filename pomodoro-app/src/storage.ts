import { DEFAULT_IMAGES } from "@/utils/constants";
import type { Settings } from "@/types"; // 👈 importante: type-only import

const KEYS = {
  work: "workTime",
  short: "shortBreak",
  long: "longBreak",
  bg: "bgImage",
};

export const loadSettings = (): Settings => ({
  workTime: Number(localStorage.getItem(KEYS.work) || 25),
  shortBreak: Number(localStorage.getItem(KEYS.short) || 5),
  longBreak: Number(localStorage.getItem(KEYS.long) || 15),
  bgImage: localStorage.getItem(KEYS.bg) || DEFAULT_IMAGES[0],
});

export const saveSettings = (s: Settings) => {
  localStorage.setItem(KEYS.work, String(s.workTime));
  localStorage.setItem(KEYS.short, String(s.shortBreak));
  localStorage.setItem(KEYS.long, String(s.longBreak));
  localStorage.setItem(KEYS.bg, s.bgImage || DEFAULT_IMAGES[0]);
};
