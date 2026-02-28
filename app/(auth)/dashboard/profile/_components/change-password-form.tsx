"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient, useSession } from "@/lib/auth-client"
import { writeAuthLog } from "@/lib/auth-log-client"
import { toast } from "sonner"

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { data: session } = useSession()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast.error("两次输入的密码不一致")
      await writeAuthLog({
        operation: "CHANGE_PASSWORD",
        content: "新密码与确认密码不一致",
        result: "FAILURE",
        fallbackUserName: session?.user.email,
      })
      return
    }

    if (newPassword.length < 8) {
      toast.error("密码长度至少 8 位")
      await writeAuthLog({
        operation: "CHANGE_PASSWORD",
        content: "新密码长度不足 8 位",
        result: "FAILURE",
        fallbackUserName: session?.user.email,
      })
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
        await writeAuthLog({
          operation: "CHANGE_PASSWORD",
          content: `修改密码失败: ${error.code || "UNKNOWN"}`,
          result: "FAILURE",
          fallbackUserName: session?.user.email,
        })
        return
      }

      toast.success("密码修改成功，请重新登录")
      await writeAuthLog({
        operation: "CHANGE_PASSWORD",
        content: "用户修改密码成功",
        result: "SUCCESS",
        fallbackUserName: session?.user.email,
      })

      await authClient.signOut()
      router.replace("/sign-in")
    } catch {
      toast.error("密码修改失败，请稍后重试")
      await writeAuthLog({
        operation: "CHANGE_PASSWORD",
        content: "修改密码接口异常",
        result: "FAILURE",
        fallbackUserName: session?.user.email,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="text" name="username" autoComplete="username" style={{ display: "none" }} aria-hidden="true" />

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
        <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="请输入新密码" autoComplete="new-password" required />
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
