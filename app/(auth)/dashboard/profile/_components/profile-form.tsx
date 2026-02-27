"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { Loader2, Camera } from "lucide-react"

interface ProfileFormProps {
  user: {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [name, setName] = useState(user.name || "")
  const [avatarUrl, setAvatarUrl] = useState(user.image || "")
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 验证文件类型
    if (!file.type.startsWith("image/")) {
      toast.error("请选择图片文件")
      return
    }

    // 验证文件大小 (最大 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("图片大小不能超过 2MB")
      return
    }

    setIsUploading(true)

    try {
      // 转换为 base64 预览
      const reader = new FileReader()
      reader.onload = async (event) => {
        const base64 = event.target?.result as string
        setAvatarUrl(base64)
        setIsUploading(false)
      }
      reader.onerror = () => {
        toast.error("图片读取失败")
        setIsUploading(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      toast.error("图片处理失败")
      setIsUploading(false)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await authClient.updateUser({
        name,
        image: avatarUrl,
      })
      toast.success("资料更新成功")
      router.refresh()
    } catch (error) {
      toast.error("更新失败，请重试")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleUpdateProfile} className="space-y-6">
      {/* 头像上传 */}
      <div className="flex items-center gap-4">
        <button type="button" onClick={() => fileInputRef.current?.click()} className="relative group cursor-pointer" disabled={isUploading}>
          <Avatar className="size-20 transition-opacity group-hover:opacity-80">
            <AvatarImage src={avatarUrl || undefined} className="object-cover" />
            <AvatarFallback className="text-2xl">{name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="size-6 text-white" />
          </div>
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
              <Loader2 className="size-6 text-white animate-spin" />
            </div>
          )}
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        <div className="text-sm text-muted-foreground">
          <p>点击更换头像</p>
          <p>支持 JPG、PNG，最大 2MB</p>
        </div>
      </div>

      {/* 用户名 */}
      <div className="space-y-2">
        <Label htmlFor="name">用户名</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="请输入用户名" />
      </div>

      <Button type="submit" disabled={isLoading || isUploading}>
        {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
        保存更改
      </Button>
    </form>
  )
}
