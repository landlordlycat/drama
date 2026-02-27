"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast.error("两次输入的密码不一致")
      return
    }

    if (newPassword.length < 8) {
      toast.error("密码长度至少为 8 位")
      return
    }

    setIsLoading(true)

    try {
      const { error } = await authClient.changePassword({
        currentPassword,
        newPassword,
      })

      if (error) {
        const errorMessages: Record<string, string> = {
          PASSWORD_TOO_SHORT: "密码长度不足",
          INVALID_PASSWORD: "当前密码不正确",
          PASSWORDS_DONT_MATCH: "两次输入的密码不一致",
        }
        toast.error(errorMessages[error.code || ""] || error.message || "密码修改失败")
        return
      }

      toast.success("密码修改成功，请重新登录")

      // 退出登录
      await authClient.signOut()

      // 跳转到登录页
      router.replace("/sign-in")
    } catch (error) {
      toast.error("密码修改失败，请稍后重试")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="current-password">当前密码</Label>
        <Input
          id="current-password"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="请输入当前密码"
          autoComplete="current-password"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="new-password">新密码</Label>
        <Input
          id="new-password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="请输入新密码"
          autoComplete="new-password"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm-password">确认新密码</Label>
        <Input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="请再次输入新密码"
          autoComplete="new-password"
          required
        />
      </div>
      <Button type="submit" disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}>
        {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
        更新密码
      </Button>
    </form>
  )
}
