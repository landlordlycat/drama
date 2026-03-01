"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Loader2 } from "lucide-react"
import { useSession } from "@/lib/auth-client"
import { ProfileForm } from "./_components/profile-form"
import { ChangePasswordForm } from "./_components/change-password-form"
import { ChangeEmailForm } from "./_components/change-email-form"

export default function ProfilePage() {
  const { data: session, isPending } = useSession()

  if (isPending) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const user = session?.user
  if (!user) {
    return null
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-4">
      <h1 className="mx-auto w-full max-w-2xl self-start text-xl font-semibold">设置</h1>

      <div className="w-full max-w-2xl space-y-6">
        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center gap-4 pb-4">
            <Avatar className="size-16">
              <AvatarImage src={user.image || undefined} className="object-cover" />
              <AvatarFallback className="text-xl">{user.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-lg font-medium">{user.name || "未设置昵称"}</h2>
            </div>
            <Badge variant="default">用户</Badge>
          </div>

          <div className="space-y-3 pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">邮箱</span>
              <span>{user.email}</span>
            </div>
            <Separator className="bg-accent" />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">注册时间</span>
              <span>{user.createdAt ? new Date(user.createdAt).toLocaleDateString("zh-CN") : "-"}</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <h3 className="mb-4 text-lg font-medium">编辑资料</h3>
          <ProfileForm user={user} />
        </div>

        <div className="rounded-xl border bg-card p-6">
          <h3 className="mb-4 text-lg font-medium">修改邮箱</h3>
          <ChangeEmailForm />
        </div>

        <div className="rounded-xl border bg-card p-6">
          <h3 className="mb-4 text-lg font-medium">修改密码</h3>
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  )
}
