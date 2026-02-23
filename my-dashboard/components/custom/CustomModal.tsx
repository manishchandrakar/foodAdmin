"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { cn } from "@/utils/utils"

interface CustomModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
  size?: "sm" | "md" | "lg" | "xl"
}

const sizeMap = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
}

const CustomModal = ({
  open,
  onOpenChange,
  title,
  children,
  footer,
  size = "md",
}: CustomModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("p-0 gap-0 overflow-hidden", sizeMap[size])}>
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b border-lightGray">
          <DialogTitle className="text-base font-semibold text-slateGray">
            {title}
          </DialogTitle>
        </DialogHeader>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <DialogFooter className="px-6 py-4 border-t border-lightGray flex gap-2 justify-end">
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default CustomModal
