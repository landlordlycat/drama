"use client"

import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { useRouter } from "next/navigation"
import { ReactNode, useEffect, useRef, useState } from "react"

interface ModalProps {
  children: ReactNode
  title?: string
  description?: string
}

export default function Modal({ children, title, description }: ModalProps) {
  const router = useRouter()
  const [open, setOpen] = useState(true)
  const skipBackRef = useRef(false)

  useEffect(() => {
    const handleDismiss = () => {
      skipBackRef.current = true
      setOpen(false)
    }

    window.addEventListener("dismiss-intercepted-modal", handleDismiss)
    return () => window.removeEventListener("dismiss-intercepted-modal", handleDismiss)
  }, [])

  const handleOpenChange = (open: boolean) => {
    setOpen(open)
    if (!open) {
      if (skipBackRef.current) {
        skipBackRef.current = false
        return
      }

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
