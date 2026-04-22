'use client'

import { useState, useRef } from 'react'
import { ImagePlus, X } from 'lucide-react'

type Props = {
  imagePreview: string | null
  uploading: boolean
  onFile: (file: File) => void
  onClear: () => void
}

export function ImageUpload({ imagePreview, uploading, onFile, onClear }: Props) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    setDragging(true)
  }

  function handleDragLeave(e: React.DragEvent) {
    // Only clear if leaving the drop zone itself, not a child element
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragging(false)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) onFile(file)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) onFile(file)
    // Reset input so the same file can be re-selected after clearing
    e.target.value = ''
  }

  if (imagePreview) {
    return (
      <div className="relative w-full aspect-video bg-neutral-900 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imagePreview} alt="Event preview" className="w-full h-full object-cover" />
        <button
          type="button"
          onClick={onClear}
          className="absolute top-2 right-2 bg-neutral-900/80 hover:bg-neutral-900 text-white p-1.5 transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    )
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`flex flex-col items-center justify-center gap-2 w-full py-10 border border-dashed cursor-pointer transition-colors ${
        dragging
          ? 'border-primary-400 bg-primary-400/5'
          : 'border-neutral-700 bg-neutral-800/50 hover:bg-neutral-800'
      }`}
    >
      <ImagePlus size={20} className={dragging ? 'text-primary-400' : 'text-neutral-500'} />
      <p className={`text-xs ${dragging ? 'text-primary-400' : 'text-neutral-500'}`}>
        {uploading ? 'Uploading…' : dragging ? 'Drop to upload' : 'Click or drag an image here'}
      </p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        disabled={uploading}
        onChange={handleChange}
      />
    </div>
  )
}
