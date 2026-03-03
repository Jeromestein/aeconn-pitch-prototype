"use client"

import { useState } from "react"
import {useTranslations} from "next-intl"
import { Mail, ArrowRight, Sparkles } from "lucide-react"
import {useRouter} from "@/i18n/navigation"

export default function AdminLoginPage() {
  const t = useTranslations("consoleLogin")
  const [email, setEmail] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    setIsSending(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSent(true)
    // Auto-redirect after "magic link click" simulation
    setTimeout(() => {
      router.push("/internal/console/dashboard")
    }, 2000)
  }

  return (
    <div className="flex min-h-screen">
      {/* Left: Decorative panel */}
      <div className="relative hidden flex-1 flex-col justify-between overflow-hidden bg-surface-1 p-12 lg:flex">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #C9A84C 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }} />
        </div>

        {/* Top brand */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/30 bg-background">
            <span className="text-xl font-bold text-primary">A</span>
          </div>
          <span className="text-xl font-semibold text-foreground">
            Aeconn
          </span>
        </div>

        {/* Center content */}
        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <Sparkles className="h-7 w-7 text-primary" />
          </div>
          <h2 className="max-w-md text-balance text-3xl font-bold leading-tight text-foreground">
            {t("heroTitle")}
          </h2>
          <p className="max-w-md text-balance text-muted-foreground leading-relaxed">
            {t("heroSubtitle")}
          </p>
        </div>

        {/* Bottom stats */}
        <div className="relative z-10 flex gap-8">
          <div>
            <p className="text-2xl font-bold text-primary">120+</p>
            <p className="text-sm text-muted-foreground">{t("statsCustomers")}</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">280+</p>
            <p className="text-sm text-muted-foreground">{t("statsCheckins")}</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">85%</p>
            <p className="text-sm text-muted-foreground">{t("statsConsent")}</p>
          </div>
        </div>
      </div>

      {/* Right: Login form */}
      <div className="flex flex-1 flex-col items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile brand */}
          <div className="mb-12 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/30 bg-surface-1">
              <span className="text-xl font-bold text-primary">A</span>
            </div>
            <span className="text-xl font-semibold text-foreground">Aeconn</span>
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-foreground">
              {t("signInTitle")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("signInSubtitle")}
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">
                {t("emailLabel")}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/50" />
                <input
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="min-h-[48px] w-full rounded-lg border border-border bg-surface-2 py-3 pl-10 pr-4 text-base text-foreground placeholder:text-muted-foreground/50 transition-all duration-200 hover:border-primary/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>

            <button
              onClick={handleLogin}
              disabled={isSending || isSent}
              className="group flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-all duration-300 hover:shadow-[0_0_40px_rgba(201,168,76,0.25)] active:scale-[0.98] disabled:opacity-60"
            >
              {isSent ? (
                t("redirecting")
              ) : isSending ? (
                <span className="flex items-center gap-2">
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                    <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
                  </svg>
                  {t("sending")}
                </span>
              ) : (
                <>
                  {t("send")}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </div>

          {isSent && (
            <div className="mt-6 animate-in fade-in slide-in-from-bottom-2 rounded-lg border border-primary/20 bg-primary/5 p-4">
              <p className="text-sm text-primary">
                {t("sentHint")}
              </p>
            </div>
          )}

          <p className="mt-8 text-center text-xs text-muted-foreground/60">
            {t("footer")}
          </p>
        </div>
      </div>
    </div>
  )
}
