"use client"

import {ShieldAlert, ArrowLeft} from "lucide-react"
import {useTranslations} from "next-intl"
import {Link} from "@/i18n/navigation"

export default function LocaleNotFoundPage() {
  const t = useTranslations("notFound")

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background p-8 text-center">
      <div className="relative">
        <div
          className="absolute inset-0 rounded-full bg-primary/5 blur-3xl"
          style={{width: 200, height: 200, left: -60, top: -60}}
        />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-border/50 bg-surface-1">
          <ShieldAlert className="h-10 w-10 text-primary/60" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-6xl font-bold text-foreground">404</h1>
        <p className="text-lg text-muted-foreground">{t("title")}</p>
        <p className="text-sm text-muted-foreground/60">{t("desc")}</p>
      </div>

      <div className="flex gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("backHome")}
        </Link>
        <Link
          href="/kiosk"
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:shadow-[0_0_30px_rgba(201,168,76,0.2)]"
        >
          {t("openKiosk")}
        </Link>
      </div>
    </div>
  )
}
