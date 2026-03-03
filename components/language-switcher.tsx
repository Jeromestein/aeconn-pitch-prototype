"use client"

import {useTransition} from "react"
import {useLocale, useTranslations} from "next-intl"
import {usePathname, useRouter} from "@/i18n/navigation"

const locales = [
  {value: "en", label: "EN"},
  {value: "zh", label: "中文"},
] as const

export function LanguageSwitcher() {
  const t = useTranslations("languageSwitcher")
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const onSwitch = (nextLocale: (typeof locales)[number]["value"]) => {
    if (nextLocale === locale) return
    startTransition(() => {
      router.replace(pathname, {locale: nextLocale})
    })
  }

  return (
    <div className="fixed right-4 top-4 z-[60] rounded-xl border border-border/60 bg-background/90 p-1 shadow-sm backdrop-blur">
      <div className="sr-only">{t("label")}</div>
      <div className="flex items-center gap-1">
        {locales.map((item) => {
          const active = locale === item.value
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onSwitch(item.value)}
              disabled={isPending || active}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              {item.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
