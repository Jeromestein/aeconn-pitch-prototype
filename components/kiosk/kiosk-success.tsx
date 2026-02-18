"use client"

import { useEffect, useState } from "react"
import { CheckCircle2 } from "lucide-react"

interface KioskSuccessProps {
  onReset: () => void
}

export function KioskSuccess({ onReset }: KioskSuccessProps) {
  const [countdown, setCountdown] = useState(8)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          onReset()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [onReset])

  const progress = ((8 - countdown) / 8) * 100

  return (
    <div className="flex flex-col items-center gap-8 text-center">
      {/* Success icon with glow */}
      <div className="relative">
        <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" style={{ animationDuration: "2s" }} />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 shadow-[0_0_60px_rgba(201,168,76,0.2)]">
          <CheckCircle2 className="h-10 w-10 text-primary" />
        </div>
      </div>

      {/* Message */}
      <div className="flex flex-col gap-3">
        <h2 className="text-3xl font-bold text-foreground">
          Check-in Complete
        </h2>
        <p className="text-balance text-lg text-muted-foreground">
          Your information has been saved. Our team will assist you shortly.
        </p>
      </div>

      {/* Progress bar */}
      <div className="flex w-full max-w-xs flex-col gap-2">
        <div className="h-1 w-full overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full rounded-full bg-primary transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Auto reset in {countdown}s
        </p>
      </div>

      {/* Manual reset */}
      <button
        onClick={onReset}
        className="rounded-lg border border-border px-6 py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
      >
        New Check-in
      </button>
    </div>
  )
}
