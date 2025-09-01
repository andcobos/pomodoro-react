export type Mode = "work" | "shortBreak" | "longBreak";

export interface Settings {
  workTime: number;      // minutos
  shortBreak: number;    // minutos
  longBreak: number;     // minutos
  bgImage: string | null;
}
