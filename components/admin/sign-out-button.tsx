"use client"

import { useState } from "react"
import { LogOut } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase/browser"

type Props = {
  collapsed: boolean
  className?: string
}

export function SignOutButton({ collapsed, className }: Props) {
  const t = useTranslations("adminSidebar")
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSignOut = async () => {
    setIsSubmitting(true)

    try {
      const supabase = getSupabaseBrowserClient()
      await supabase.auth.signOut()
      router.replace("/internal")
      router.refresh()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={isSubmitting}
      className={className}
    >
      <LogOut className="h-5 w-5 flex-shrink-0" />
      {!collapsed && <span>{isSubmitting ? t("signingOut") : t("signOut")}</span>}
    </button>
  )
}
