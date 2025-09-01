import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsForm({
  workTime, shortBreak, longBreak,
  onChangeWork, onChangeShort, onChangeLong,
}: {
  workTime: number;
  shortBreak: number;
  longBreak: number;
  onChangeWork: (n: number) => void;
  onChangeShort: (n: number) => void;
  onChangeLong: (n: number) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <Label className="text-gray-700 font-medium mb-2 block">Work Time (minutes)</Label>
        <Input type="number" min={1} value={workTime} onChange={(e) => onChangeWork(Number(e.target.value))} className="rounded-full border-2 px-4 py-3"/>
      </div>
      <div>
        <Label className="text-gray-700 font-medium mb-2 block">Short Break (minutes)</Label>
        <Input type="number" min={1} value={shortBreak} onChange={(e) => onChangeShort(Number(e.target.value))} className="rounded-full border-2 px-4 py-3"/>
      </div>
      <div>
        <Label className="text-gray-700 font-medium mb-2 block">Long Break (minutes)</Label>
        <Input type="number" min={1} value={longBreak} onChange={(e) => onChangeLong(Number(e.target.value))} className="rounded-full border-2 px-4 py-3"/>
      </div>
    </div>
  );
}
