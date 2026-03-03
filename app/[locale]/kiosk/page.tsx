"use client"

import { useState, useEffect, useCallback } from "react"
import { KioskWelcome } from "@/components/kiosk/kiosk-welcome"
import { KioskForm } from "@/components/kiosk/kiosk-form"
import { KioskSuccess } from "@/components/kiosk/kiosk-success"

type KioskStep = "welcome" | "form" | "success"

export default function KioskPage() {
  const [step, setStep] = useState<KioskStep>("welcome")
  const [idleTimer, setIdleTimer] = useState<ReturnType<typeof setTimeout> | null>(null)

  const resetToWelcome = useCallback(() => {
    setStep("welcome")
  }, [])

  // Idle timeout: 60s of no interaction -> back to welcome
  useEffect(() => {
    if (step === "welcome") return

    const resetIdle = () => {
      if (idleTimer) clearTimeout(idleTimer)
      const timer = setTimeout(resetToWelcome, 60000)
      setIdleTimer(timer)
    }

    resetIdle()
    window.addEventListener("touchstart", resetIdle)
    window.addEventListener("mousemove", resetIdle)
    window.addEventListener("keydown", resetIdle)

    return () => {
      if (idleTimer) clearTimeout(idleTimer)
      window.removeEventListener("touchstart", resetIdle)
      window.removeEventListener("mousemove", resetIdle)
      window.removeEventListener("keydown", resetIdle)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {step === "welcome" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <KioskWelcome onStart={() => setStep("form")} />
          </div>
        )}
        {step === "form" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <KioskForm
              onSuccess={() => setStep("success")}
              onReset={resetToWelcome}
            />
          </div>
        )}
        {step === "success" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <KioskSuccess onReset={resetToWelcome} />
          </div>
        )}
      </div>
    </div>
  )
}
