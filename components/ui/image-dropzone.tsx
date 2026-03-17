"use client"

import { useCallback, useState, DragEvent } from 'react'
import { Upload, X } from 'lucide-react'
import { Button } from './button'
import { Card, CardContent } from './card'

interface ImageDropzoneProps {
  onImageSelect: (file: File) => void
  className?: string
}

export function ImageDropzone({ onImageSelect, className = '' }: ImageDropzoneProps) {
  const [dragActive, setDragActive] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const onDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }, [])

  const onDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }, [])

  const onDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      const file = files[0]
      onImageSelect(file)
      const previewUrl = URL.createObjectURL(file)
      setPreview(previewUrl)
    }
  }, [onImageSelect])

  const onFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      onImageSelect(file)
      const previewUrl = URL.createObjectURL(file)
      setPreview(previewUrl)
    }
  }, [onImageSelect])

  const clearPreview = useCallback(() => {
    setPreview(null)
  }, [])

  return (
    <div 
      className={`
        relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 cursor-pointer
        group hover:border-primary/50 hover:shadow-lg
        ${dragActive ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-border/50'}
        ${className}
      `}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {preview ? (
        <div className="space-y-4">
          <div className="relative">
            <img 
              src={preview} 
              alt="Preview"
              className="w-full h-64 object-cover rounded-xl shadow-lg"
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute -top-3 -right-3 rounded-full p-1 h-8 w-8 shadow-lg hover:shadow-xl cursor-pointer"
              onClick={clearPreview}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Archivo seleccionado ✓
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 group-hover:bg-primary/20 p-4 rounded-2xl transition-colors">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-lg group-hover:text-primary transition-colors">
                Arrastra tu imagen aquí o click para seleccionar
              </p>
              <p className="text-sm text-muted-foreground">
                PNG, JPG hasta 5MB
              </p>
            </div>
            <Button variant="outline" size="sm" className="cursor-pointer" asChild>
              <label>
                Seleccionar archivo
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={onFileSelect}
                />
              </label>
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
