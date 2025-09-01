import { Button } from "@/components/ui/button";

export default function ModeSelector({
  show,
  workTime,
  shortBreak,
  longBreak,
  onSelect,
}: {
  show: boolean;
  workTime: number;
  shortBreak: number;
  longBreak: number;
  onSelect: (mode: "work" | "shortBreak" | "longBreak") => void;
}) {
  if (!show) return null;
  return (
    <div className="flex justify-center gap-2 mb-4">
      <Button variant="outline" onClick={() => onSelect("work")}>
        Work ({workTime} min)
      </Button>
      <Button variant="outline" onClick={() => onSelect("shortBreak")}>
        Short Break ({shortBreak} min)
      </Button>
      <Button variant="outline" onClick={() => onSelect("longBreak")}>
        Long Break ({longBreak} min)
      </Button>
    </div>
  );
}
