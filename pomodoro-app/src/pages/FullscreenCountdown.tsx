import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function FullscreenCountdown() {
  const [timeLeft, setTimeLeft] = useState(0)
  const [bgImage, setBgImage] = useState<string | null>(null)
  const navigate = useNavigate()

  // Cargar datos desde LocalStorage
  useEffect(() => {
    const workTime = Number(localStorage.getItem("workTime") || 25)
    setTimeLeft(workTime * 60)

    const image = localStorage.getItem("bgImage")
    setBgImage(image)
  }, [])

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      navigate("/") // vuelve al Pomodoro si acaba el tiempo
      return
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [timeLeft, navigate])

  // Escape para salir
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") navigate("/")
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [navigate])

  // Formatear tiempo
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center text-white text-6xl font-bold"
      style={{
        backgroundImage: `url(${bgImage || "/images/bg1.png"})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {formatTime(timeLeft)}
    </div>
  )
}
