import { formatHMS } from "@/utils/format";

export default function TimerDisplay({ seconds }: { seconds: number }) {
  return (
    <div className="text-5xl md:text-6xl font-extrabold">
      {formatHMS(seconds)}
    </div>
  );
}
