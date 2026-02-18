"use client"

import Link from "next/link"
import { Monitor, Tablet } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-12 bg-background p-8">
      {/* Logo / brand */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-primary/30 bg-surface-1">
            <span className="text-2xl font-bold text-primary">A</span>
          </div>
          <span className="text-3xl font-bold tracking-tight text-foreground">
            Aeconn
          </span>
        </div>
        <p className="text-center text-muted-foreground">
          Intelligent Customer Check-in & Marketing Platform
        </p>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-6 sm:flex-row">
        <Link
          href="/kiosk"
          className="group flex w-72 flex-col items-center gap-4 rounded-xl border border-border/60 bg-surface-1 p-8 transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_40px_rgba(201,168,76,0.08)]"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
            <Tablet className="h-8 w-8" />
          </div>
          <div className="text-center">
            <h2 className="text-lg font-semibold text-foreground">
              Kiosk
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Touchscreen Check-in
            </p>
          </div>
        </Link>

        <Link
          href="/admin"
          className="group flex w-72 flex-col items-center gap-4 rounded-xl border border-border/60 bg-surface-1 p-8 transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_40px_rgba(201,168,76,0.08)]"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
            <Monitor className="h-8 w-8" />
          </div>
          <div className="text-center">
            <h2 className="text-lg font-semibold text-foreground">
              Admin Dashboard
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Operations & Marketing
            </p>
          </div>
        </Link>
      </div>

      <p className="text-xs text-muted-foreground/60">
        Pitch Prototype v1.0 — All data is mock
      </p>
    </div>
  )
}
