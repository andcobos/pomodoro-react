import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"

export default function FullscreenCountdown() {
  const [timeLeft, setTimeLeft] = useState(0)
  const [bgImage, setBgImage] = useState<string | null>(null)
  const [isCompact, setIsCompact] = useState(false)
  const navigate = useNavigate()

  // Cargar y solicitar fullscreen
  useEffect(() => {
    const workTime = Number(localStorage.getItem("workTime") || 25)
    setTimeLeft(workTime * 60)

    const image = localStorage.getItem("bgImage")
    setBgImage(image || "/images/bg1.png")

    // pedir fullscreen
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {
        // si falla por interacción requerida, no rompemos
      })
    }
  }, [])

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      if (document.fullscreenElement) document.exitFullscreen()
      navigate("/")
      return
    }
    const id = setInterval(() => setTimeLeft((p) => p - 1), 1000)
    return () => clearInterval(id)
  }, [timeLeft, navigate])

  // Teclas: Esc y T
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (document.fullscreenElement) document.exitFullscreen()
        navigate("/")
      }
      if (e.key.toLowerCase() === "t") setIsCompact((v) => !v)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [navigate])

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  return (
    <div
      className="min-h-screen w-full relative text-white font-bold"
      style={{
        backgroundImage: `url(${bgImage || "/images/bg1.png"})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Botón Toggle */}
      <div className="absolute top-4 left-4">
        <Button
          variant="secondary"
          className="bg-black/40 hover:bg-black/50 text-white backdrop-blur rounded-full"
          onClick={() => setIsCompact((v) => !v)}
          title="Toggle reloj (T)"
        >
          <Clock className="mr-2 h-4 w-4" />
          {isCompact ? "Centrar grande" : "Reloj pequeño"}
        </Button>
      </div>

      {/* Reloj */}
      {isCompact ? (
        <div className="absolute top-4 right-6 text-2xl bg-black/40 px-4 py-2 rounded-lg backdrop-blur">
          {formatTime(timeLeft)}
        </div>
      ) : (
        <div className="flex items-center justify-center h-screen text-7xl drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
          {formatTime(timeLeft)}
        </div>
      )}
    </div>
  )
}
