"use client"

import Image from "next/image"
import {useTranslations} from "next-intl"

interface KioskWelcomeProps {
  onStart: () => void
}

export function KioskWelcome({ onStart }: KioskWelcomeProps) {
  const t = useTranslations("kioskWelcome")

  return (
    <div className="flex flex-col items-center gap-10 text-center">
      {/* Brand */}
      <div className="flex flex-col items-center gap-2">
        <Image
          src="/Aeconn_logo.png"
          alt="Aeconn"
          width={600}
          height={160}
          priority
          className="h-auto w-[260px] max-w-full sm:w-[320px]"
        />
      </div>

      {/* Welcome text */}
      <div className="flex flex-col gap-3">
        <h2 className="text-balance text-2xl font-semibold text-foreground">
          {t("title")}
        </h2>
        <p className="text-balance text-lg text-muted-foreground">
          {t("subtitle")}
        </p>
      </div>

      {/* CTA */}
      <button
        onClick={onStart}
        className="group relative min-h-[56px] w-full max-w-xs overflow-hidden rounded-xl bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground transition-all duration-300 hover:shadow-[0_0_40px_rgba(201,168,76,0.25)] active:scale-[0.98]"
      >
        <span className="relative z-10">{t("start")}</span>
        <div className="absolute inset-0 bg-gold-light/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </button>

      <p className="text-sm text-muted-foreground/60">
        {t("hint")}
      </p>
    </div>
  )
}
