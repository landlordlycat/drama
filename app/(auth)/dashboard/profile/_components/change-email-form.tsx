"use client"

import { useMemo, useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { authClient, useSession } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function ChangeEmailForm() {
  const { data: session } = useSession()
  const [newEmail, setNewEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const currentEmail = session?.user?.email || ""
  const callbackURL = useMemo(() => {
    if (typeof window === "undefined") return "/sign-in"
    return `${window.location.origin}/sign-in`
  }, [])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const nextEmail = newEmail.trim().toLowerCase()
    if (!EMAIL_REGEX.test(nextEmail)) {
      toast.error("请输入正确的邮箱")
      return
    }
    if (nextEmail === currentEmail.toLowerCase()) {
      toast.error("新邮箱不能与当前邮箱一致")
      return
    }

    setIsLoading(true)
    try {
      const { error } = await authClient.changeEmail({
        newEmail: nextEmail,
        callbackURL,
      })

      if (error) {
        const messageByCode: Record<string, string> = {
          INVALID_EMAIL: "邮箱格式不正确",
          USER_ALREADY_EXISTS: "该邮箱已被使用",
        }
        toast.error(messageByCode[error.code || ""] || error.message || "修改邮箱失败")
        return
      }

      setNewEmail("")
      toast.success("验证邮件已发送到新邮箱，请点击邮件链接完成修改")
    } catch {
      toast.error("修改邮箱失败，请稍后重试")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>当前邮箱</Label>
        <Input value={currentEmail} disabled />
      </div>

      <div className="space-y-2">
        <Label htmlFor="new-email">新邮箱</Label>
        <Input
          id="new-email"
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder="请输入新的邮箱地址"
          required
        />
      </div>

      <Button type="submit" disabled={isLoading || !newEmail.trim()}>
        {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
        发送验证邮件
      </Button>
    </form>
  )
}
