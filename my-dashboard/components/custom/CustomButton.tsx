"use client"

import { cn } from "@/utils/utils"

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: React.ReactNode
  isLoading?: boolean
  isDisabled?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  variant?: "solid" | "outline" | "ghost" | "danger"
}

const CustomButton = ({
  text,
  isLoading,
  isDisabled,
  leftIcon,
  rightIcon,
  variant = "solid",
  className,
  children,
  ...props
}: CustomButtonProps) => {
  return (
    <button
      disabled={isDisabled || isLoading}
      className={cn(
        "h-9 px-4 rounded-md inline-flex items-center justify-center gap-2 text-sm font-medium transition-colors cursor-pointer",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variant === "solid"   && "bg-themeColor text-white hover:bg-themeColor/90",
        variant === "outline" && "border border-lightGray bg-white text-slateGray hover:bg-gray-50",
        variant === "ghost"   && "bg-transparent text-slateGray hover:bg-gray-100",
        variant === "danger"  && "bg-red-500 text-white hover:bg-red-600",
        className
      )}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin h-4 w-4 shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {!isLoading && leftIcon && <span className="flex items-center">{leftIcon}</span>}
      {text ?? children}
      {rightIcon && <span className="flex items-center">{rightIcon}</span>}
    </button>
  )
}

export default CustomButton
