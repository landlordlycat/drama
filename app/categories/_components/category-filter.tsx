"use client"

import { TypeItem } from "@/lib/types/api"
import { cn } from "@/lib/utils"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LayoutGrid, Tags, ChevronDown, Loader2 } from "lucide-react"
import { useTransition } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface CategoryFilterProps {
  types: TypeItem[]
}

export default function CategoryFilter({ types }: CategoryFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const currentTypeId = searchParams.get("typeId") || ""

  const handleTypeClick = (typeId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (typeId) {
      params.set("typeId", typeId)
    } else {
      params.delete("typeId")
    }
    // 切换分类时重置到第一页
    params.delete("page")

    // 使用 startTransition 标记为非阻塞跳转，让 UI 保持响应
    startTransition(() => {
      router.push(`/categories?${params.toString()}`)
    })
  }

  // 检查某个主分类及其子分类是否被选中
  const isTypeSelected = (type: TypeItem) => {
    if (currentTypeId === type.id.toString()) return true
    return type.children?.some((child) => child.id.toString() === currentTypeId)
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-primary">
          <LayoutGrid className="w-5 h-5" />
          <h2 className="text-lg font-bold tracking-tight">影片分类</h2>
          {isPending && <Loader2 className="w-4 h-4 animate-spin ml-2 opacity-50" />}
        </div>

        <div className="bg-muted/30 p-4 rounded-2xl border border-border/50">
          <div className="flex items-start gap-4">
            <div className="flex items-center gap-2 mt-2 text-muted-foreground shrink-0">
              <Tags className="w-4 h-4" />
              <span className="text-sm font-medium">类型:</span>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant={currentTypeId === "" ? "default" : "ghost"}
                size="sm"
                onClick={() => handleTypeClick("")}
                className={cn("rounded-full px-5 h-9", currentTypeId === "" ? "shadow-none" : "hover:bg-background/80")}
              >
                全部
              </Button>

              {types.map((type) => {
                const hasChildren = type.children && type.children.length > 0
                const active = isTypeSelected(type)

                if (hasChildren) {
                  return (
                    <DropdownMenu key={type.id}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant={active ? "default" : "ghost"}
                          size="sm"
                          className={cn("rounded-full px-5 h-9 gap-1", active ? "shadow-none" : "hover:bg-background/80 text-muted-foreground hover:text-foreground")}
                        >
                          {type.typeName}
                          <ChevronDown className="w-3 h-3 opacity-50" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="rounded-xl p-1 min-w-[120px]">
                        <DropdownMenuItem
                          onClick={() => handleTypeClick(type.id.toString())}
                          className={cn("rounded-lg cursor-pointer", currentTypeId === type.id.toString() ? "bg-accent font-medium" : "")}
                        >
                          全部{type.typeName}
                        </DropdownMenuItem>
                        {type.children?.map((child) => (
                          <DropdownMenuItem
                            key={child.id}
                            onClick={() => handleTypeClick(child.id.toString())}
                            className={cn("rounded-lg cursor-pointer", currentTypeId === child.id.toString() ? "bg-accent font-medium" : "")}
                          >
                            {child.typeName}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )
                }

                return (
                  <Button
                    key={type.id}
                    variant={currentTypeId === type.id.toString() ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handleTypeClick(type.id.toString())}
                    className={cn("rounded-full px-5 h-9", currentTypeId === type.id.toString() ? "shadow-none" : "hover:bg-background/80 text-muted-foreground hover:text-foreground")}
                  >
                    {type.typeName}
                  </Button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
