import Link from "next/link"
import { ShieldAlert, ArrowLeft } from "lucide-react"

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background p-8 text-center">
      {/* Decorative element */}
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-primary/5 blur-3xl" style={{ width: 200, height: 200, left: -60, top: -60 }} />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-border/50 bg-surface-1">
          <ShieldAlert className="h-10 w-10 text-primary/60" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-6xl font-bold text-foreground">404</h1>
        <p className="text-lg text-muted-foreground">Page not found</p>
        <p className="text-sm text-muted-foreground/60">
          The page you are looking for does not exist or you don&apos;t have permission to access it.
        </p>
      </div>

      <div className="flex gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back Home
        </Link>
        <Link
          href="/admin/dashboard"
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:shadow-[0_0_30px_rgba(201,168,76,0.2)]"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  )
}
