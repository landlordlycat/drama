"use client"

import { useState } from "react"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { signIn } from "@/lib/auth-client"
import { writeAuthLog } from "@/lib/auth-log-client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const ALLOW_SIGN_UP = process.env.NEXT_PUBLIC_AUTH_ALLOW_SIGN_UP !== "false"

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleSignIn = async () => {
    await signIn.email({
      email: email.trim().toLowerCase(),
      password,
      rememberMe,
      callbackURL: "/",
      fetchOptions: {
        onRequest: () => setLoading(true),
        onResponse: () => setLoading(false),
        onSuccess: () => {
          toast.success("登录成功")
          writeAuthLog({
            operation: "LOGIN",
            content: "邮箱密码登录",
            result: "SUCCESS",
            fallbackUserName: email,
          })
        },
        onError: (ctx) => {
          const message = String(ctx.error?.message || "")
          const code = String(ctx.error?.code || "")
          const isUnverified = /verify|verified|email/i.test(message) || /verify|verified|email/i.test(code)

          toast.error(isUnverified ? "请先验证邮箱后再登录" : "账号或密码错误")
          writeAuthLog({
            operation: "LOGIN",
            content: isUnverified ? "邮箱未验证，登录失败" : "邮箱密码登录失败",
            result: "FAILURE",
            fallbackUserName: email,
          })
        },
      },
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="max-w-md flex-1">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">登录</CardTitle>
          <CardDescription className="text-xs md:text-sm">请输入邮箱和密码登录</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">邮箱</Label>
              <Input id="email" type="email" placeholder="m@example.com" required onChange={(e) => setEmail(e.target.value)} value={email} />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">密码</Label>
                <Link href="/forgot-password" className="ml-auto inline-block text-sm underline">
                  忘记密码？
                </Link>
              </div>
              <Input id="password" type="password" placeholder="password" autoComplete="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox id="remember" checked={rememberMe} onCheckedChange={(checked) => setRememberMe(checked === true)} />
              <Label htmlFor="remember">记住我</Label>

              {ALLOW_SIGN_UP && (
                <Link href="/sign-up" className="ml-auto">
                  <Button variant="link" className="text-xs">
                    没有账号？去注册
                  </Button>
                </Link>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading} onClick={handleSignIn}>
              {loading ? <Loader2 size={16} className="animate-spin" /> : <p>登录</p>}
            </Button>

            <div className={cn("flex w-full items-center gap-2", "justify-between flex-col")}>
              <Button
                variant="outline"
                className="w-full gap-2"
                disabled={loading}
                onClick={async () => {
                  await signIn.social({
                    provider: "github",
                    callbackURL: "/dashboard",
                    fetchOptions: {
                      onRequest: () => setLoading(true),
                      onResponse: () => setLoading(false),
                    },
                  })
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"
                  />
                </svg>
                使用 GitHub 登录
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
