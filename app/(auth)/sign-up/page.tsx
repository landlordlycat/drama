"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import Image from "next/image"
import { Loader2, X } from "lucide-react"
import { signUp } from "@/lib/auth-client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function SignUp() {
  const [firstName, setFirstName] = useState("")
  // const [lastName, setLastName] = useState("")

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirmation, setPasswordConfirmation] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="z-50 rounded-md rounded-t-none max-w-md flex-1">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">注册</CardTitle>
          <CardDescription className="text-xs md:text-sm"> 请输入您的个人信息 </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {/* <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first-name">First name</Label>
                <Input
                  id="first-name"
                  placeholder="Max"
                  required
                  onChange={(e) => {
                    setFirstName(e.target.value)
                  }}
                  value={firstName}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last-name">Last name</Label>
                <Input
                  id="last-name"
                  placeholder="Robinson"
                  required
                  onChange={(e) => {
                    setLastName(e.target.value)
                  }}
                  value={lastName}
                />
              </div>
            </div> */}
            <div className="grid gap-2">
              <Label htmlFor="name">昵称</Label>
              <Input
                id="name"
                placeholder="昵称"
                onChange={(e) => {
                  setFirstName(e.target.value)
                }}
                value={firstName}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">邮箱</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                onChange={(e) => {
                  setEmail(e.target.value)
                }}
                value={email}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">密码</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" placeholder="Password" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password_confirmation">确认密码</Label>
              <Input
                id="password_confirmation"
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                autoComplete="new-password"
                placeholder="Confirm Password"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image">头像 (可选)</Label>
              <div className="flex items-end gap-4">
                {imagePreview && (
                  <div className="relative w-16 h-16 rounded-sm overflow-hidden">
                    <Image src={imagePreview} alt="Profile preview" layout="fill" objectFit="cover" />
                  </div>
                )}
                <div className="flex items-center gap-2 w-full">
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
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
              onClick={async () => {
                await signUp.email({
                  email,
                  password,
                  // name: `${firstName} ${lastName}`,
                  name: firstName,
                  image: image ? await convertImageToBase64(image) : "",
                  callbackURL: "/dashboard",
                  fetchOptions: {
                    onResponse: () => {
                      setLoading(false)
                    },
                    onRequest: () => {
                      setLoading(true)
                    },
                    onError: (ctx) => {
                      toast.error(ctx.error.message)
                    },
                    onSuccess: () => {
                      router.push("/dashboard")
                    },
                  },
                })
              }}
            >
              {loading ?
                <Loader2 size={16} className="animate-spin" />
              : "注册"}
            </Button>
          </div>
          <span className="text-sm mt-3 block text-muted-foreground cursor-pointer" onClick={() => router.push("/sign-in")}>
            已有账号？ 登录
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
