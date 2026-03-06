"use client"

import { useCallback, useRef, useState } from "react"
import { useMutation } from "@tanstack/react-query"
import Image from "next/image"
import { cn } from "@/utils/utils"
import { FaCloudUploadAlt, FaTrash } from "react-icons/fa"
import { showErrorToast } from "@/utils/toastUtils"

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  label?: string
  className?: string
}

const ImageUpload = (props: ImageUploadProps) => {
  const { value, onChange, label = "Image", className } = props
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  // ✅ React Query Mutation
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"
      const formData = new FormData()
      formData.append("file", file)

      // Use native fetch so the browser sets the correct multipart Content-Type boundary.
      // credentials: "include" sends the session cookie to the Express backend.
      const res = await fetch(`${baseUrl}/api/upload`, {
        method: "POST",
        body: formData,
        credentials: "include",
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Upload failed")
      }

      // Backend returns a relative path like "/uploads/abc.jpg".
      // Prefix with the backend base URL so <img src> works across origins.
      const relativeUrl = data.url as string
      return relativeUrl.startsWith("http") ? relativeUrl : `${baseUrl}${relativeUrl}`
    },

    onSuccess: (url) => {
      onChange(url)
    },

    onError: (error: unknown) => {
      showErrorToast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Something went wrong",
      })
    },
  })

  const upload = useCallback(
    (file: File) => {
      uploadMutation.mutate(file)
    },
    [uploadMutation]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      const file = e.dataTransfer.files[0]
      if (file) upload(file)
    },
    [upload]
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) upload(file)
    e.target.value = ""
  }

  const handleRemove = () => {
    onChange("")
  }

  return (
    <div className={cn("grid gap-2", className)}>
      {label && (
        <label className="block text-left text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {label}
        </label>
      )}

      {value ? (
        <div className="relative group rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden h-40">
          <Image src={value} alt="Preview" fill className="object-cover" unoptimized />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            <FaTrash size={12} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => !uploadMutation.isPending && inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={cn(
            "flex flex-col items-center justify-center gap-2 h-40 rounded-lg border-2 border-dashed cursor-pointer transition-colors",
            dragOver
              ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
              : "border-zinc-300 dark:border-zinc-600 hover:border-zinc-400 dark:hover:border-zinc-500",
            uploadMutation.isPending && "pointer-events-none opacity-60"
          )}
        >
          {uploadMutation.isPending ? (
            <div className="flex flex-col items-center gap-2 text-zinc-500">
              <div className="h-8 w-8 border-2 border-zinc-300 border-t-blue-500 rounded-full animate-spin" />
              <span className="text-sm">Uploading...</span>
            </div>
          ) : (
            <>
              <FaCloudUploadAlt className="text-3xl text-zinc-400" />
              <span className="text-sm text-zinc-500">
                Drag & drop or click to upload
              </span>
              <span className="text-xs text-zinc-400">
                JPG, PNG, (max 5MB)
              </span>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg/,image/png,"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}

export default ImageUpload