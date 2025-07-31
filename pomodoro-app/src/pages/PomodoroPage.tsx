import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { HTMLMotionProps } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { useTimer } from "@/hooks/useTimer"
import { useNavigate } from "react-router-dom"

// Splash cursor effect component
const SplashCursor = (): JSX.Element => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isClicking, setIsClicking] = useState(false)

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)

    window.addEventListener("mousemove", updateMousePosition)
    window.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mouseup", handleMouseUp)

    return () => {
      window.removeEventListener("mousemove", updateMousePosition)
      window.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [])

  const motionProps: HTMLMotionProps<"div"> = {
    className: "fixed top-0 left-0 w-6 h-6 bg-orange-500 rounded-full pointer-events-none z-50 mix-blend-difference",
    animate: {
      x: mousePosition.x - 12,
      y: mousePosition.y - 12,
      scale: isClicking ? 1.5 : 1,
    },
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 28,
    },
  }

  return <motion.div {...motionProps} />
}

const [settingsApplied, setSettingsApplied] = useState(false)

  // Agrega esto arriba del componente (después de imports)
  const defaultImages = [
    "/images/bg1.png",
    "/images/bg2.jpg",
    "/images/bg3.jpg"
  ]

// Pomodoro hook that uses the actual useTimer
const usePomodoro = () => {
  const [workTime, setWorkTime] = useState(25)
  const [shortBreak, setShortBreak] = useState(5)
  const [longBreak, setLongBreak] = useState(15)
  
  const { time: timeInSeconds, start, pause, reset: resetTimer, isRunning } = useTimer(workTime * 60)
  
  // Convert seconds to hours, minutes, seconds format
  const hours = Math.floor(timeInSeconds / 3600)
  const minutes = Math.floor((timeInSeconds % 3600) / 60)
  const seconds = timeInSeconds % 60
  
  const time = { hours, minutes, seconds }
  
  const reset = () => {
    resetTimer()
  }

  return {
    time,
    isRunning,
    start,
    pause,
    reset,
    workTime,
    setWorkTime,
    shortBreak,
    setShortBreak,
    longBreak,
    setLongBreak,
  }
}

export default function PomodoroPage() {
  const { time, isRunning, start, pause, reset, workTime, setWorkTime, shortBreak, setShortBreak, longBreak, setLongBreak } =
    usePomodoro()

  const navigate = useNavigate()

  const [showSplash, setShowSplash] = useState(false)

  //imagen de fondo
  const [bgImage, setBgImage] = useState<string | null>(null);
  // Cargar imagen al iniciar

  // Cargar datos guardados
  useEffect(() => {
    const savedImage = localStorage.getItem("bgImage")
    if (savedImage) setBgImage(savedImage)

    const savedWorkTime = localStorage.getItem("workTime")
    const savedShortBreak = localStorage.getItem("shortBreak")
    const savedLongBreak = localStorage.getItem("longBreak")

    if (savedWorkTime) setWorkTime(Number(savedWorkTime))
    if (savedShortBreak) setShortBreak(Number(savedShortBreak))
    if (savedLongBreak) setLongBreak(Number(savedLongBreak))
  }, [])

    // Guardar tiempos y fondo en LocalStorage
  const handleSaveSettings = () => {
    localStorage.setItem("workTime", workTime.toString())
    localStorage.setItem("shortBreak", shortBreak.toString())
    localStorage.setItem("longBreak", longBreak.toString())
    if (bgImage) localStorage.setItem("bgImage", bgImage)
    setSettingsApplied(true)
  }

  // Subir imagen personalizada
  const handleUpload = (file: File) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      setBgImage(reader.result as string)
      localStorage.setItem("bgImage", reader.result as string)
    }
    reader.readAsDataURL(file)
  }


  const handleStart = () => {
    start()
    setShowSplash(true)
    setTimeout(() => setShowSplash(false), 300)
  }

  const formatTime = (value: number) => value.toString().padStart(2, "0")

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      <SplashCursor />

      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-200 rounded-full opacity-30"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.header
        className="flex justify-between items-center p-6 relative z-10"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1
          className="text-2xl font-bold text-gray-800"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          StudyTime
        </motion.h1>
        <nav className="flex space-x-8">
          {["Main", "About"].map((item, index) => (
            <motion.a
              key={item}
              href="#"
              className="text-gray-600 hover:text-gray-800 transition-colors"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              whileHover={{ y: -2 }}
            >
              {item}
            </motion.a>
          ))}
        </nav>
      </motion.header>

      {/* Main Content */}
      <div className="w-full px-6 relative z-10">
        {/* Timer Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h2
            className="text-4xl font-bold text-gray-800 mb-8"
            animate={{
              scale: isRunning ? [1, 1.02, 1] : 1,
            }}
            transition={{
              duration: 1,
              repeat: isRunning ? Number.POSITIVE_INFINITY : 0,
            }}
          >
            Pomodoro Timer
          </motion.h2>

          {/* Timer Display */}
          <div className="flex justify-center space-x-4 mb-8">
            {[
              { value: time.hours, label: "Hours" },
              { value: time.minutes, label: "Minutes" },
              { value: time.seconds, label: "Seconds" },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                className="text-center"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.5 }}
              >
                <motion.div
                  className="bg-gray-200 rounded-2xl px-8 py-6 mb-2 min-w-[120px]"
                  animate={{
                    scale: isRunning && item.label === "Seconds" ? [1, 1.05, 1] : 1,
                    backgroundColor: isRunning ? ["#e5e7eb", "#fed7aa", "#e5e7eb"] : "#e5e7eb",
                  }}
                  transition={{
                    duration: 1,
                    repeat: isRunning ? Number.POSITIVE_INFINITY : 0,
                  }}
                >
                  <span className="text-4xl font-bold text-gray-800">{formatTime(item.value)}</span>
                </motion.div>
                <p className="text-gray-600 font-medium">{item.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Control Buttons */}
          <div className="flex justify-center space-x-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={isRunning ? pause : handleStart}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full text-lg font-semibold"
              >
                {isRunning ? "Pause" : "Start"}
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: settingsApplied ? 1.05 : 1 }} whileTap={{ scale: settingsApplied ? 0.95 : 1 }}>
              <Button
                variant="outline"
                className="px-8 py-3 rounded-full text-lg font-semibold border-2 bg-transparent"
                disabled={!settingsApplied}
                onClick={() => navigate("/fullscreen")}
              >
                Fullscreen
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Customize Section */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Customize</h3>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column - Time Settings */}
            <div className="space-y-6">
              {[
                { label: "Work Time (minutes)", value: workTime, setter: setWorkTime },
                { label: "Short Break (minutes)", value: shortBreak, setter: setShortBreak },
                { label: "Long Break (minutes)", value: longBreak, setter: setLongBreak },
              ].map((setting, index) => (
                <motion.div
                  key={setting.label}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.8 }}
                >
                  <Label className="text-gray-700 font-medium mb-2 block">{setting.label}</Label>
                  <Input
                    type="number"
                    value={setting.value}
                    onChange={(e) => setting.setter(Number(e.target.value))}
                    className="rounded-full border-2 px-4 py-3"
                  />
                </motion.div>
              ))}
            </div>

            {/* Right Column - Theme Settings */}
            <div className="space-y-6">
              {/* Imagenes por default */}
              <Label className="text-gray-700 font-medium mb-2 block">Default Images</Label>
              <div className="flex gap-4 mb-4">
                {defaultImages.map((img) => (
                  <img
                    key={img}
                    src={img}
                    alt="background option"
                    onClick={() => setBgImage(img)}
                    className={`w-20 h-14 rounded-lg cursor-pointer border-2 ${
                      bgImage === img ? "border-blue-500" : "border-transparent"
                    }`}
                  />
                ))}
              </div>

              {/* Subir imagen */}
              <Label className="text-gray-700 font-medium mb-2 block">Upload Image</Label>
              <Input
                type="file"
                accept="image/*"
                className="rounded-full border-2 px-4 py-3"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleUpload(file)
                }}
              />
            </div>
          </div>

          {/* Apply Settings Button */}
          <motion.div
            className="text-center mt-8"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full text-lg font-semibold"
                onClick={handleSaveSettings}
              >
                Apply Settings
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
    
  )
}
