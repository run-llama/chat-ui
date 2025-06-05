'use client'

import { useState } from 'react'
import { DocumentFile } from '../widgets'

export function useFile({ uploadAPI }: { uploadAPI: string }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [files, setFiles] = useState<DocumentFile[]>([])

  const addDoc = (file: DocumentFile) => {
    const existedFile = files.find(f => f.id === file.id)
    if (!existedFile) {
      setFiles(prev => [...prev, file])
      return true
    }
    return false
  }

  const removeDoc = (file: DocumentFile) => {
    setFiles(prev => prev.filter(f => f.id !== file.id))
  }

  const reset = () => {
    imageUrl && setImageUrl(null)
    files.length && setFiles([])
  }

  const uploadContent = async (
    file: File,
    requestParams: any = {}
  ): Promise<DocumentFile> => {
    const base64 = await readContent({ file, asUrl: true })
    const response = await fetch(uploadAPI, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...requestParams,
        base64,
        name: file.name,
      }),
    })
    if (!response.ok) throw new Error('Failed to upload document.')
    return (await response.json()) as DocumentFile
  }

  const getAnnotations = () => {
    const annotations = []
    if (imageUrl) {
      annotations.push({
        type: 'image',
        data: { url: imageUrl },
      })
    }
    if (files.length > 0) {
      annotations.push({
        type: 'document_file',
        data: { files },
      })
    }
    return annotations
  }

  const readContent = async (input: {
    file: File
    asUrl?: boolean
  }): Promise<string> => {
    const { file, asUrl } = input
    const content = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      if (asUrl) {
        reader.readAsDataURL(file)
      } else {
        reader.readAsText(file)
      }
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
    return content
  }

  const uploadFile = async (file: File, requestParams: any = {}) => {
    if (file.type.startsWith('image/')) {
      const base64 = await readContent({ file, asUrl: true })
      return setImageUrl(base64)
    }

    // Upload any non-image file as a document
    const newDoc = await uploadContent(file, requestParams)
    return addDoc(newDoc)
  }

  return {
    imageUrl,
    setImageUrl,
    files,
    removeDoc,
    reset,
    getAnnotations,
    uploadFile,
  }
}
