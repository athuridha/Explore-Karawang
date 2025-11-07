"use client"

import * as React from "react"
import Image from "next/image"
import { Upload, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ImageUploadInputProps {
  value: string
  onChange: (url: string) => void
  placeholder?: string
  label?: string
  required?: boolean
}

export function ImageUploadInput({
  value,
  onChange,
  placeholder = "Paste image URL or upload",
  label = "Image URL",
  required = false,
}: ImageUploadInputProps) {
  const [uploading, setUploading] = React.useState(false)
  const [error, setError] = React.useState("")
  const [preview, setPreview] = React.useState<string | null>(value || null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileUpload = async (file: File) => {
    setUploading(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        const url = result.data.url
        onChange(url)
        setPreview(url)
      } else {
        setError(result.error || "Upload failed")
      }
    } catch (err) {
      setError("Failed to upload file")
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    onChange(url)
    setPreview(url || null)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith("image/")) {
      handleFileUpload(file)
    }
  }

  const handleClear = () => {
    onChange("")
    setPreview(null)
    setError("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>

      {/* Preview */}
      {preview && (
        <div className="relative h-32 w-full bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover"
            unoptimized={!preview.startsWith('/')}
            onError={() => {
              setError("Failed to load image")
              setPreview(null)
            }}
          />
          <button
            onClick={handleClear}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* URL Input */}
      <div className="flex gap-2">
        <Input
          type="text"
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={uploading}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="gap-2"
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Upload
            </>
          )}
        </Button>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />

      {/* Drag & Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-colors"
      >
        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600">
          Drag & drop your image here
          <br />
          or click the Upload button
        </p>
        <p className="text-xs text-gray-500 mt-1">
          JPG, PNG, WebP, GIF • Max 5MB
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-sm rounded-lg">
          {error}
        </div>
      )}

      {/* Current URL */}
      {value && !preview && (
        <p className="text-xs text-gray-500 truncate">Current: {value}</p>
      )}
    </div>
  )
}
