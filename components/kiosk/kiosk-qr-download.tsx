"use client"

import { useEffect, useMemo, useState, useSyncExternalStore } from "react"
import { Copy, Download, LoaderCircle, QrCode } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

function buildQrImageUrl(targetUrl: string, size: number) {
  const params = new URLSearchParams({
    size: `${size}x${size}`,
    format: "png",
    margin: "24",
    data: targetUrl,
  })

  return `https://api.qrserver.com/v1/create-qr-code/?${params.toString()}`
}

export function KioskQrDownload() {
  const locale = useLocale()
  const t = useTranslations("kioskWelcome.qr")
  const [isDownloading, setIsDownloading] = useState(false)
  const [copied, setCopied] = useState(false)
  const origin = useSyncExternalStore(
    () => () => undefined,
    () => window.location.origin,
    () => ""
  )

  useEffect(() => {
    if (!copied) return

    const timer = window.setTimeout(() => setCopied(false), 2000)
    return () => window.clearTimeout(timer)
  }, [copied])

  const kioskUrl = useMemo(() => {
    if (!origin) {
      return ""
    }

    return `${origin}/${locale}/kiosk`
  }, [locale, origin])

  const previewUrl = useMemo(() => {
    if (!kioskUrl) {
      return ""
    }

    return buildQrImageUrl(kioskUrl, 320)
  }, [kioskUrl])

  const downloadUrl = useMemo(() => {
    if (!kioskUrl) {
      return ""
    }

    return buildQrImageUrl(kioskUrl, 1080)
  }, [kioskUrl])

  const handleDownload = async () => {
    if (!downloadUrl) return

    setIsDownloading(true)

    try {
      const response = await fetch(downloadUrl)
      if (!response.ok) {
        throw new Error("QR_DOWNLOAD_FAILED")
      }

      const blob = await response.blob()
      const blobUrl = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = blobUrl
      link.download = "aeconn-checkin-qr.png"
      link.click()
      URL.revokeObjectURL(blobUrl)
    } catch {
      window.open(downloadUrl, "_blank")
    } finally {
      setIsDownloading(false)
    }
  }

  const handleCopy = async () => {
    if (!kioskUrl) return

    try {
      await navigator.clipboard.writeText(kioskUrl)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-border/60 bg-background/75 p-4 text-left shadow-[0_24px_80px_rgba(0,0,0,0.06)] backdrop-blur">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-primary">
          <QrCode className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">{t("title")}</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {t("description")}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-[120px_minmax(0,1fr)] md:items-center">
        <div className="mx-auto w-full max-w-[120px] rounded-2xl border border-border/60 bg-white p-2">
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt={t("imageAlt")}
              className="aspect-square w-full rounded-xl"
            />
          ) : (
            <div className="aspect-square w-full animate-pulse rounded-xl bg-muted" />
          )}
        </div>

        <div className="space-y-3">
          <p className="text-xs leading-5 text-muted-foreground">
            {t("hint")}
          </p>
          <div className="rounded-xl border border-border/60 bg-surface-2 px-3 py-2 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{t("linkLabel")}</span>
            <div className="mt-1 break-all">{kioskUrl || t("loading")}</div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleDownload}
              disabled={!downloadUrl || isDownloading}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isDownloading ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {isDownloading ? t("downloading") : t("download")}
            </button>
            <button
              type="button"
              onClick={handleCopy}
              disabled={!kioskUrl}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Copy className="h-4 w-4" />
              {copied ? t("copied") : t("copy")}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
