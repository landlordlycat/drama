"use client"

import { ChangePasswordForm } from "./_components/change-password-form"

export default function UsersPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-2xl font-semibold">账户设置</h1>
      <div className="w-full max-w-md rounded-xl border bg-card p-6">
        <h2 className="mb-4 text-lg font-medium">更新密码</h2>
        <ChangePasswordForm />
      </div>
    </div>
  )
}
