import { Suspense } from "react"
import { ResetPasswordPageClient } from "./reset-password-page-client"

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">加载中...</div>}>
      <ResetPasswordPageClient />
    </Suspense>
  )
}
