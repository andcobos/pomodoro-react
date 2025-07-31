import { useState, useEffect } from "react"

export default function FullscreenCountdown() {
  const [timeLeft, setTimeLeft] = useState(0)
  const [bgImage, setBgImage] = useState<string | null>(null)

  useEffect(() => {
    // cargar datos desde LocalStorage
    const workTime = Number(localStorage.getItem("workTime") || 25)
    setTimeLeft(workTime * 60)

    const image = localStorage.getItem("bgImage")
    if (image) setBgImage(image)
  }, [])

  useEffect(() => {
    if (timeLeft <= 0) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [timeLeft])

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center text-white text-6xl font-bold"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {formatTime(timeLeft)}
    </div>
  )
}
