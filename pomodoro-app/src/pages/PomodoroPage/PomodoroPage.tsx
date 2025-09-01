import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Controls from "./components/Controls";
import TimerDisplay from "./components/TimerDisplay";
import ModeSelector from "./components/ModeSelector";
import BackgroundPicker from "./components/BackgroundPicker";
import SettingsForm from "./components/SettingsForm";
import FullscreenOverlay from "./components/FullscreenOverlay";
import { DEFAULT_IMAGES } from "@/utils/constants";
import { loadSettings, saveSettings } from "@/storage";
import { usePomodoroController } from "@/hooks/usePomodoroController";
import { Button } from "@/components/ui/button";

export default function PomodoroPage() {
  const initial = loadSettings();
  const [workTime, setWorkTime] = useState(initial.workTime);
  const [shortBreak, setShortBreak] = useState(initial.shortBreak);
  const [longBreak, setLongBreak] = useState(initial.longBreak);
  const [bgImage, setBgImage] = useState<string | null>(initial.bgImage);
  const [settingsApplied, setSettingsApplied] = useState(false);

  const {
    mode, finished, isFullscreen,
    timeInSeconds, isRunning,
    start, pause, resetTimer, switchTo, enterFullscreen, exitFullscreen,
  } = usePomodoroController(workTime, shortBreak, longBreak);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") exitFullscreen(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [exitFullscreen]);

  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => { if (reader.result) setBgImage(reader.result as string); };
    reader.readAsDataURL(file);
  };

  const applySettings = () => {
    saveSettings({ workTime, shortBreak, longBreak, bgImage });
    setSettingsApplied(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      <motion.header className="flex justify-between items-center p-6">
        <h1 className="text-2xl font-bold text-gray-800">StudyTime</h1>
      </motion.header>

      <section className="text-center mb-10">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">
          {mode === "work" ? "Work Session" : mode === "shortBreak" ? "Short Break" : "Long Break"}
        </h2>

        <div className="mb-2">
          <TimerDisplay seconds={timeInSeconds} />
        </div>

        <ModeSelector
          show={finished}
          workTime={workTime}
          shortBreak={shortBreak}
          longBreak={longBreak}
          onSelect={(m) => switchTo(m)}
        />

        <Controls
          isRunning={isRunning}
          finished={finished}
          onStart={() => { start(); }}
          onPause={() => { pause(); }}
          onReset={() => { resetTimer(); }}
          onFullscreen={() => {
            // persiste cosas útiles antes de entrar
            saveSettings({ workTime, shortBreak, longBreak, bgImage });
            enterFullscreen();
          }}
          fullscreenDisabled={!settingsApplied}
        />
      </section>

      <section className="max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Customize</h3>
        <div className="grid md:grid-cols-2 gap-8">
          <SettingsForm
            workTime={workTime}
            shortBreak={shortBreak}
            longBreak={longBreak}
            onChangeWork={setWorkTime}
            onChangeShort={setShortBreak}
            onChangeLong={setLongBreak}
          />
          <BackgroundPicker
            images={DEFAULT_IMAGES}
            selected={bgImage}
            onSelect={setBgImage}
            onUpload={handleUpload}
          />
        </div>

        <div className="text-center mt-8">
          <Button
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full text-lg font-semibold"
            onClick={applySettings}
          >
            Apply Settings
          </Button>
        </div>
      </section>

      {isFullscreen && (
        <FullscreenOverlay
          bgImage={bgImage}
          seconds={timeInSeconds}
          isRunning={isRunning}
          finished={finished}
          workTime={workTime}
          shortBreak={shortBreak}
          longBreak={longBreak}
          onStopOrResume={() => (isRunning ? pause() : start())}
          onReset={() => resetTimer()}
          onExit={exitFullscreen}
          onSelectMode={(m) => switchTo(m)}
        />
      )}
    </div>
  );
}
