"use client"

import Link from "next/link"
import { FormEvent, useMemo, useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const redirectTo = useMemo(() => {
    if (typeof window === "undefined") {
      return "/reset-password"
    }
    return `${window.location.origin}/reset-password`
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextEmail = email.trim().toLowerCase()
    if (!EMAIL_REGEX.test(nextEmail)) {
      toast.error("请输入正确的邮箱")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/auth/request-password-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: nextEmail,
          redirectTo,
        }),
      })

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null
        throw new Error(payload?.message || "发送重置邮件失败")
      }

      setSent(true)
      toast.success("如果该邮箱已注册，我们已发送重置邮件")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "发送重置邮件失败")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="max-w-md flex-1">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">找回密码</CardTitle>
          <CardDescription className="text-xs md:text-sm">输入注册邮箱，我们会发送重置链接。</CardDescription>
        </CardHeader>

        <CardContent>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="email">邮箱</Label>
              <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <Button type="submit" className="w-full" disabled={loading || sent}>
              {loading ? <Loader2 size={16} className="animate-spin" /> : "发送重置邮件"}
            </Button>
          </form>

          <div className="mt-4 text-sm text-muted-foreground">
            <Link href="/sign-in" className="underline">
              返回登录
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
