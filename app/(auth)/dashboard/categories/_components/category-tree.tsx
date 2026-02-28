"use client"

import { useEffect, useMemo, useState } from "react"
import { TypeItem } from "@/lib/types/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { ChevronDown, ChevronRight, FolderTree, Tag } from "lucide-react"
import { toast } from "sonner"

interface CategoryTreeProps {
  types: TypeItem[]
  sourceName: string
  initialHiddenTypeIds: number[]
}

export default function CategoryTree({ types, sourceName, initialHiddenTypeIds }: CategoryTreeProps) {
  const parentIds = useMemo(() => types.filter((item) => (item.children?.length ?? 0) > 0).map((item) => item.id), [types])
  const allTypeIds = useMemo(() => {
    const ids: number[] = []
    types.forEach((type) => {
      ids.push(type.id)
      type.children?.forEach((child) => ids.push(child.id))
    })
    return ids
  }, [types])
  const [expandedIds, setExpandedIds] = useState<Set<number>>(() => new Set(parentIds))
  const [hiddenIds, setHiddenIds] = useState<Set<number>>(new Set(initialHiddenTypeIds))
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setExpandedIds(new Set(parentIds))
  }, [parentIds])

  useEffect(() => {
    setHiddenIds(new Set(initialHiddenTypeIds))
  }, [initialHiddenTypeIds])

  const expandAll = () => setExpandedIds(new Set(parentIds))
  const collapseAll = () => setExpandedIds(new Set())

  const updateManyVisible = async (typeIds: number[], visible: boolean) => {
    setSaving(true)
    try {
      const res = await fetch("/api/admin/categories/visibility", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceName, typeIds, visible }),
      })
      if (!res.ok) throw new Error("request failed")

      setHiddenIds((prev) => {
        const next = new Set(prev)
        typeIds.forEach((id) => {
          if (visible) next.delete(id)
          else next.add(id)
        })
        return next
      })
    } catch (error) {
      toast.error("更新可见性失败")
    } finally {
      setSaving(false)
    }
  }

  const updateOneVisible = async (id: number, visible: boolean) => {
    const prev = new Set(hiddenIds)
    setHiddenIds((current) => {
      const next = new Set(current)
      if (visible) next.delete(id)
      else next.add(id)
      return next
    })

    try {
      const res = await fetch("/api/admin/categories/visibility", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceName, typeId: id, visible }),
      })
      if (!res.ok) throw new Error("request failed")
    } catch (error) {
      setHiddenIds(prev)
      toast.error("更新可见性失败")
    }
  }

  const showAll = () => updateManyVisible(allTypeIds, true)
  const hideAll = () => updateManyVisible(allTypeIds, false)

  const toggleNode = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <Card>
      <CardHeader className="space-y-3">
        <CardTitle className="text-base">分类可见性管理</CardTitle>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={showAll} disabled={saving}>
            全部显示
          </Button>
          <Button variant="outline" size="sm" onClick={hideAll} disabled={saving}>
            全部隐藏
          </Button>
          <Button variant="outline" size="sm" onClick={expandAll}>
            全部展开
          </Button>
          <Button variant="outline" size="sm" onClick={collapseAll}>
            全部收起
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {types.length === 0 ? (
          <p className="text-sm text-muted-foreground">暂无分类数据</p>
        ) : (
          <ul className="space-y-5">
            {types.map((type) => {
              const children = type.children ?? []
              const hasChildren = children.length > 0
              const isExpanded = expandedIds.has(type.id)

              return (
                <li key={type.id} className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {hasChildren ? (
                        <Button variant="ghost" size="icon-sm" onClick={() => toggleNode(type.id)} aria-label={isExpanded ? "收起节点" : "展开节点"}>
                          {isExpanded ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
                        </Button>
                      ) : (
                        <span className="w-7" />
                      )}
                      <FolderTree className="size-4 text-muted-foreground" />
                      <span className="font-medium">{type.typeName}</span>
                      <Badge variant="secondary" className="text-xs">
                        编号: {type.id}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{hiddenIds.has(type.id) ? "已隐藏" : "可见"}</span>
                      <Switch checked={!hiddenIds.has(type.id)} onCheckedChange={(checked) => updateOneVisible(type.id, checked)} disabled={saving} />
                    </div>
                  </div>

                  {hasChildren && isExpanded && (
                    <ul className="ml-2 space-y-2 border-l pl-4">
                      {children.map((child) => (
                        <li key={child.id} className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">|-</span>
                            <Tag className="size-3.5 text-muted-foreground" />
                            <span className="text-sm">{child.typeName}</span>
                            <Badge variant="outline" className="text-xs">
                              {child.id}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">{hiddenIds.has(child.id) ? "已隐藏" : "可见"}</span>
                            <Switch checked={!hiddenIds.has(child.id)} onCheckedChange={(checked) => updateOneVisible(child.id, checked)} disabled={saving} />
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
