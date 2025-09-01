import { Button } from "@/components/ui/button";

export default function Controls({
  isRunning,
  finished,
  onStart,
  onPause,
  onReset,
  onFullscreen,
  fullscreenDisabled,
}: {
  isRunning: boolean;
  finished: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onFullscreen: () => void;
  fullscreenDisabled?: boolean;
}) {
  return (
    <div className="flex justify-center gap-3">
      <Button
        onClick={isRunning ? onPause : onStart}
        className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full"
      >
        {isRunning ? "Pause" : finished ? "Start Selected" : "Start"}
      </Button>
      <Button variant="outline" onClick={onReset} className="rounded-full">
        Reset
      </Button>
      <Button variant="outline" onClick={onFullscreen} disabled={fullscreenDisabled} className="rounded-full">
        Fullscreen
      </Button>
    </div>
  );
}
