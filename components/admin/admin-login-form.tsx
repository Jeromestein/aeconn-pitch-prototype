"use client"

import Image from "next/image"
import { useState } from "react"
import { Mail, ArrowRight, Sparkles, ShieldCheck } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase/browser"
import { hasSupabaseBrowserEnv } from "@/lib/supabase/env"
import { normalizeAdminEmail } from "@/lib/auth/shared"

type LoginStep = "email" | "otp"

function isValidOtp(value: string) {
  return /^\d{6,8}$/.test(value)
}

export function AdminLoginForm() {
  const t = useTranslations("consoleLogin")
  const router = useRouter()
  const [loginStep, setLoginStep] = useState<LoginStep>("email")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [infoMessage, setInfoMessage] = useState<string | null>(null)

  const handleSendOtp = async () => {
    const normalizedEmail = normalizeAdminEmail(email)
    if (!normalizedEmail) {
      setErrorMessage(t("errors.emailRequired"))
      return
    }

    if (!hasSupabaseBrowserEnv()) {
      setErrorMessage(t("errors.config"))
      return
    }

    setIsSubmitting(true)
    setErrorMessage(null)
    setInfoMessage(null)

    try {
      const whitelistResponse = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: normalizedEmail }),
      })

      const whitelistPayload = await whitelistResponse.json().catch(() => null)
      if (!whitelistResponse.ok) {
        setErrorMessage(whitelistPayload?.error ?? t("errors.generic"))
        return
      }

      const supabase = getSupabaseBrowserClient()
      const { error } = await supabase.auth.signInWithOtp({
        email: normalizedEmail,
        options: {
          shouldCreateUser: false,
        },
      })

      if (error) {
        const lowerMessage = error.message.toLowerCase()
        if (lowerMessage.includes("fetch")) {
          setErrorMessage(t("errors.recovery"))
          return
        }

        setErrorMessage(t("errors.generic"))
        return
      }

      setEmail(normalizedEmail)
      setLoginStep("otp")
      setInfoMessage(t("otpSentHint", { email: normalizedEmail }))
    } catch {
      setErrorMessage(t("errors.recovery"))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (!isValidOtp(otp)) {
      setErrorMessage(t("errors.invalidOtp"))
      return
    }

    setIsSubmitting(true)
    setErrorMessage(null)
    setInfoMessage(null)

    try {
      const supabase = getSupabaseBrowserClient()
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "email",
      })

      if (error) {
        setErrorMessage(t("errors.invalidOtp"))
        return
      }

      const adminStatusResponse = await fetch("/api/auth/admin-status", {
        method: "GET",
      })

      if (!adminStatusResponse.ok) {
        await supabase.auth.signOut()
        const payload = await adminStatusResponse.json().catch(() => null)
        setErrorMessage(payload?.error ?? t("errors.generic"))
        return
      }

      router.replace("/internal/dashboard")
      router.refresh()
    } catch {
      setErrorMessage(t("errors.recovery"))
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetToEmailStep = () => {
    setLoginStep("email")
    setOtp("")
    setErrorMessage(null)
    setInfoMessage(null)
  }

  return (
    <div className="flex min-h-screen">
      <div className="relative hidden flex-1 flex-col justify-between overflow-hidden bg-surface-1 p-12 lg:flex">
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, #C9A84C 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="relative z-10">
          <Image
            src="/Aeconn_logo.png"
            alt="Aeconn"
            width={600}
            height={160}
            priority
            className="h-auto w-[180px]"
          />
        </div>

        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <Sparkles className="h-7 w-7 text-primary" />
          </div>
          <h2 className="max-w-md text-balance text-3xl font-bold leading-tight text-foreground">
            {t("heroTitle")}
          </h2>
          <p className="max-w-md text-balance leading-relaxed text-muted-foreground">
            {t("heroSubtitle")}
          </p>
        </div>

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

      <div className="flex flex-1 flex-col items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-12 lg:hidden">
            <Image
              src="/Aeconn_logo.png"
              alt="Aeconn"
              width={600}
              height={160}
              priority
              className="h-auto w-[180px]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-foreground">{t("signInTitle")}</h1>
            <p className="text-sm text-muted-foreground">{t("signInSubtitle")}</p>
          </div>

          <div className="mt-8 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">
                {loginStep === "email" ? t("emailLabel") : t("otpLabel")}
              </label>
              <div className="relative">
                {loginStep === "email" ? (
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/50" />
                ) : (
                  <ShieldCheck className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/50" />
                )}
                {loginStep === "email" ? (
                  <input
                    type="email"
                    placeholder={t("emailPlaceholder")}
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="min-h-[48px] w-full rounded-lg border border-border bg-surface-2 py-3 pl-10 pr-4 text-base text-foreground placeholder:text-muted-foreground/50 transition-all duration-200 hover:border-primary/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                ) : (
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={8}
                    placeholder={t("otpPlaceholder")}
                    value={otp}
                    onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))}
                    className="min-h-[48px] w-full rounded-lg border border-border bg-surface-2 py-3 pl-10 pr-4 text-base tracking-[0.4em] text-foreground placeholder:tracking-normal placeholder:text-muted-foreground/50 transition-all duration-200 hover:border-primary/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={loginStep === "email" ? handleSendOtp : handleVerifyOtp}
              disabled={isSubmitting}
              className="group flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-all duration-300 hover:shadow-[0_0_40px_rgba(201,168,76,0.25)] active:scale-[0.98] disabled:opacity-60"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                    <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
                  </svg>
                  {loginStep === "email" ? t("sending") : t("verifying")}
                </span>
              ) : (
                <>
                  {loginStep === "email" ? t("send") : t("verify")}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>

            {loginStep === "otp" && (
              <button
                type="button"
                onClick={resetToEmailStep}
                disabled={isSubmitting}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {t("changeEmail")}
              </button>
            )}
          </div>

          {infoMessage && (
            <div className="mt-6 rounded-lg border border-primary/20 bg-primary/5 p-4">
              <p className="text-sm text-primary">{infoMessage}</p>
            </div>
          )}

          {errorMessage && (
            <div className="mt-6 rounded-lg border border-red-500/20 bg-red-500/10 p-4">
              <p className="text-sm text-red-300">{errorMessage}</p>
            </div>
          )}

          <p className="mt-8 text-center text-xs text-muted-foreground/70">{t("footer")}</p>
        </div>
      </div>
    </div>
  )
}
