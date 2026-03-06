import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { LanguageSwitcher } from "@/components/language-switcher"
import { requireAdmin } from "@/lib/auth/admin"

export default async function AdminInnerLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  await requireAdmin(locale)

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AdminSidebar />
      <main className="flex flex-1 flex-col overflow-y-auto">
        <div className="sticky top-0 z-30 flex justify-end border-b border-border/50 bg-background/90 px-6 py-4 backdrop-blur lg:px-8">
          <LanguageSwitcher floating={false} forceVisible />
        </div>
        <div className="flex-1">
          {children}
        </div>
      </main>
    </div>
  )
}
