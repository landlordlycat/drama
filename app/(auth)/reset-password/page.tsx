"use client"

import Link from "next/link"
import { FormEvent, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const PASSWORD_MIN_LENGTH = 6
const PASSWORD_MAX_LENGTH = 12
const PASSWORD_POLICY_REGEX = /^(?=.*[A-Za-z])(?=.*\d).+$/

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [password, setPassword] = useState("")
  const [passwordConfirmation, setPasswordConfirmation] = useState("")
  const [loading, setLoading] = useState(false)

  const token = useMemo(() => searchParams.get("token") || "", [searchParams])

  const validatePassword = (value: string) => {
    if (value.length < PASSWORD_MIN_LENGTH || value.length > PASSWORD_MAX_LENGTH) {
      return `密码长度需在 ${PASSWORD_MIN_LENGTH}-${PASSWORD_MAX_LENGTH} 位之间`
    }

    if (!PASSWORD_POLICY_REGEX.test(value)) {
      return "密码需要同时包含字母和数字"
    }

    return ""
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!token) {
      toast.error("重置链接无效或已过期")
      return
    }

    const passwordError = validatePassword(password)
    if (passwordError) {
      toast.error(passwordError)
      return
    }

    if (password !== passwordConfirmation) {
      toast.error("两次输入的密码不一致")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newPassword: password,
          token,
        }),
      })

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null
        throw new Error(payload?.message || "重置密码失败")
      }

      toast.success("密码重置成功，请使用新密码登录")
      router.push("/sign-in")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "重置密码失败")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="max-w-md flex-1">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">重置密码</CardTitle>
          <CardDescription className="text-xs md:text-sm">请输入新密码并确认。</CardDescription>
        </CardHeader>

        <CardContent>
          {token ? (
            <form className="grid gap-4" onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <Label htmlFor="password">新密码</Label>
                <Input id="password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <p className="text-xs text-muted-foreground">长度 6-12 位，且必须包含字母和数字。</p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password_confirmation">确认新密码</Label>
                <Input id="password_confirmation" type="password" autoComplete="new-password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 size={16} className="animate-spin" /> : "确认重置"}
              </Button>
            </form>
          ) : (
            <div className="text-sm text-destructive">重置链接无效或已过期，请重新发起找回密码。</div>
          )}

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
