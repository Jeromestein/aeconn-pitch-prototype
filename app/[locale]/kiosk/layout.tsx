import type { Viewport } from "next"
import type { CSSProperties } from "react"

export const viewport: Viewport = {
  themeColor: "#F8F5EE",
}

const kioskLightVars = {
  "--background": "#F8F5EE",
  "--foreground": "#1F1B13",
  "--card": "#FFFFFF",
  "--card-foreground": "#1F1B13",
  "--popover": "#FFFFFF",
  "--popover-foreground": "#1F1B13",
  "--primary": "#B8923F",
  "--primary-foreground": "#141006",
  "--secondary": "#F0E8D7",
  "--secondary-foreground": "#2B2417",
  "--muted": "#EFE8D9",
  "--muted-foreground": "#6F6656",
  "--accent": "#F4ECDB",
  "--accent-foreground": "#2B2417",
  "--destructive": "#C24141",
  "--destructive-foreground": "#FFF5F5",
  "--border": "#DDD2BC",
  "--input": "#FFFFFF",
  "--ring": "#B8923F",
  "--chart-1": "#B8923F",
  "--chart-2": "#D4AF37",
  "--chart-3": "#8B7536",
  "--chart-4": "#E6CE70",
  "--chart-5": "#A08C3A",
  "--sidebar": "#F8F5EE",
  "--sidebar-foreground": "#1F1B13",
  "--sidebar-primary": "#B8923F",
  "--sidebar-primary-foreground": "#141006",
  "--sidebar-accent": "#EFE8D9",
  "--sidebar-accent-foreground": "#2B2417",
  "--sidebar-border": "#DDD2BC",
  "--sidebar-ring": "#B8923F",
  "--gold": "#B8923F",
  "--gold-light": "#E6CE70",
  "--gold-dark": "#8B7536",
  "--surface-1": "#FFFFFF",
  "--surface-2": "#F7F1E4",
  "--surface-3": "#EFE6D4",
} as CSSProperties

export default function KioskLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="kiosk-light min-h-screen bg-background" style={kioskLightVars}>
      {children}
    </div>
  )
}
