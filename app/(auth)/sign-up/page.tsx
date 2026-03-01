"use client"

import Image from "next/image"
import { useState } from "react"
import { Loader2, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { signUp } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const PASSWORD_MIN_LENGTH = 6
const PASSWORD_MAX_LENGTH = 12
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_POLICY_REGEX = /^(?=.*[A-Za-z])(?=.*\d).+$/

export default function SignUp() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirmation, setPasswordConfirmation] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImage(file)
    const reader = new FileReader()
    reader.onloadend = () => setImagePreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async () => {
    const nextName = name.trim()
    const nextEmail = email.trim().toLowerCase()

    if (!nextName) {
      toast.error("请输入昵称")
      return
    }
    if (!EMAIL_REGEX.test(nextEmail)) {
      toast.error("邮箱格式不正确")
      return
    }
    if (password.length < PASSWORD_MIN_LENGTH || password.length > PASSWORD_MAX_LENGTH) {
      toast.error(`密码长度需在 ${PASSWORD_MIN_LENGTH}-${PASSWORD_MAX_LENGTH} 位之间`)
      return
    }
    if (!PASSWORD_POLICY_REGEX.test(password)) {
      toast.error("密码需包含字母和数字")
      return
    }
    if (password !== passwordConfirmation) {
      toast.error("两次输入密码不一致")
      return
    }

    await signUp.email({
      email: nextEmail,
      password,
      name: nextName,
      image: image ? await convertImageToBase64(image) : "",
      callbackURL: "/sign-in",
      fetchOptions: {
        onRequest: () => setLoading(true),
        onResponse: () => setLoading(false),
        onError: (ctx) => {
          toast.error(ctx.error.message || "注册失败")
        },
        onSuccess: () => {
          toast.success("注册成功，请先验证邮箱")
          router.push("/sign-in")
        },
      },
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="z-50 max-w-md flex-1 rounded-md rounded-t-none">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">注册</CardTitle>
          <CardDescription className="text-xs md:text-sm">创建你的账号</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">昵称</Label>
              <Input id="name" placeholder="请输入昵称" onChange={(e) => setName(e.target.value)} value={name} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">邮箱</Label>
              <Input id="email" type="email" placeholder="m@example.com" required onChange={(e) => setEmail(e.target.value)} value={email} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">密码</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" placeholder="请输入密码" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password_confirmation">确认密码</Label>
              <Input
                id="password_confirmation"
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                autoComplete="new-password"
                placeholder="请再次输入密码"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image">头像（可选）</Label>
              <div className="flex items-end gap-4">
                {imagePreview && (
                  <div className="relative h-16 w-16 overflow-hidden rounded-sm">
                    <Image src={imagePreview} alt="Profile preview" fill className="object-cover" />
                  </div>
                )}
                <div className="flex w-full items-center gap-2">
                  <Input id="image" type="file" accept="image/*" onChange={handleImageChange} className="w-full" />
                  {imagePreview && (
                    <X
                      className="cursor-pointer"
                      onClick={() => {
                        setImage(null)
                        setImagePreview(null)
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading} onClick={handleSubmit}>
              {loading ?
                <Loader2 size={16} className="animate-spin" />
              : "注册"}
            </Button>
          </div>

          <span className="mt-3 block cursor-pointer text-sm text-muted-foreground" onClick={() => router.push("/sign-in")}>
            已有账号？去登录
          </span>
        </CardContent>
      </Card>
    </div>
  )
}

async function convertImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
