"use client"

import { forwardRef, useState } from "react"
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"
import { cn } from "@/utils/utils"

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  isRequired?: boolean
  isInvalid?: boolean
  errorMessage?: string
  description?: string
  isPassword?: boolean
  endContent?: React.ReactNode
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  (
    {
      label,
      isRequired,
      isInvalid,
      errorMessage,
      description,
      isPassword,
      endContent,
      className,
      type,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false)
    const inputType = isPassword ? (showPassword ? "text" : "password") : type

    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <label className="text-sm font-medium text-slateGray">
            {label}
            {isRequired && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            className={cn(
              "w-full h-10 px-3 py-2 text-sm rounded-md border bg-white outline-none transition-colors",
              "placeholder:text-gray-400 text-slateGray",
              isInvalid
                ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                : "border-lightGray focus:border-themeColor focus:ring-1 focus:ring-themeColor",
              (isPassword || endContent) && "pr-10",
              className
            )}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-slateGray transition-colors"
              onClick={() => setShowPassword((p) => !p)}
            >
              {showPassword
                ? <AiFillEyeInvisible size={18} />
                : <AiFillEye size={18} />}
            </button>
          )}

          {!isPassword && endContent && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {endContent}
            </div>
          )}
        </div>

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

CustomInput.displayName = "CustomInput"
export default CustomInput
