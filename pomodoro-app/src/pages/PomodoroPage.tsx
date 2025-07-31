import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { HTMLMotionProps } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { useTimer } from "@/hooks/useTimer"

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

  const [showSplash, setShowSplash] = useState(false)

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
            className="absolute w-2 h-2 bg-orange-200 rounded-full opacity-20"
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
          {["Home", "About", "Contact", "Sign up"].map((item, index) => (
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
      <div className="max-w-4xl mx-auto px-6 relative z-10">
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
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={reset}
                variant="outline"
                className="px-8 py-3 rounded-full text-lg font-semibold border-2 bg-transparent"
              >
                Reset
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Customize Section */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
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
              <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.9 }}>
                <Label className="text-gray-700 font-medium mb-2 block">Default Image</Label>
                <Card className="h-32 bg-gray-100 rounded-2xl flex items-center justify-center">
                  <p className="text-gray-500">Image Preview</p>
                </Card>
              </motion.div>

              <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 1.0 }}>
                <Label className="text-gray-700 font-medium mb-2 block">Search Themes / Upload:</Label>
                <Input type="file" accept="image/*" className="rounded-full border-2 px-4 py-3" />
              </motion.div>
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
              <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full text-lg font-semibold">
                Apply Settings
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Splash Effect */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            className="fixed inset-0 pointer-events-none z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-4 h-4 bg-orange-400 rounded-full"
                initial={{
                  x: "50vw",
                  y: "50vh",
                  scale: 0,
                }}
                animate={{
                  x: `${50 + Math.cos((i * 30 * Math.PI) / 180) * 40}vw`,
                  y: `${50 + Math.sin((i * 30 * Math.PI) / 180) * 40}vh`,
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 0.6,
                  ease: "easeOut",
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
