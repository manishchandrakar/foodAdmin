"use client"

import { forwardRef } from "react"
import { cn } from "@/utils/utils"

interface CustomTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  isRequired?: boolean
  isInvalid?: boolean
  errorMessage?: string
  description?: string
}

const CustomTextarea = forwardRef<HTMLTextAreaElement, CustomTextareaProps>(
  ({ label, isRequired, isInvalid, errorMessage, description, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <label className="text-sm font-medium text-slateGray">
            {label}
            {isRequired && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          rows={4}
          className={cn(
            "w-full px-3 py-2 text-sm rounded-md border bg-white outline-none transition-colors resize-none",
            "placeholder:text-gray-400 text-slateGray",
            isInvalid
              ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
              : "border-lightGray focus:border-themeColor focus:ring-1 focus:ring-themeColor",
            className
          )}
          {...props}
        />

        {description && !isInvalid && (
          <p className="text-xs text-gray-400">{description}</p>
        )}
        {isInvalid && errorMessage && (
          <p className="text-xs text-red-500">{errorMessage}</p>
        )}
      </div>
    )
  }
)

CustomTextarea.displayName = "CustomTextarea"
export default CustomTextarea
