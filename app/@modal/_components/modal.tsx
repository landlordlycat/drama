"use client"

import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { useRouter } from "next/navigation"
import { ReactNode, useState } from "react"

interface ModalProps {
  children: ReactNode
  title?: string
  description?: string
}

export default function Modal({ children, title, description }: ModalProps) {
  const router = useRouter()
  const [open, setOpen] = useState(true)

  const handleOpenChange = (open: boolean) => {
    setOpen(open)
    if (!open) {
      router.back()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-100 p-0 overflow-hidden rounded-3xl border-none bg-background max-h-[90vh] flex flex-col" aria-describedby={description ? "dialog-description" : undefined}>
        <VisuallyHidden>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </VisuallyHidden>
        {children}
      </DialogContent>
    </Dialog>
  )
}
