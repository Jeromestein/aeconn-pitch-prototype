import { redirect } from "next/navigation"
import { getAuthenticatedAdmin } from "@/lib/auth/admin"
import { AdminLoginForm } from "@/components/admin/admin-login-form"

type Props = {
  params: Promise<{ locale: string }>
}

export default async function AdminLoginPage({ params }: Props) {
  const { locale } = await params
  const admin = await getAuthenticatedAdmin()

  if (admin) {
    redirect(`/${locale}/internal/dashboard`)
  }

  return <AdminLoginForm />
}
