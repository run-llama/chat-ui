'use client'

import { useState } from 'react'
import { DocumentFile, FileData } from '../widgets'
import { MessagePart } from '../chat/chat.interface'
import { FilePartType } from '../chat/message-parts'

export function useFile({ uploadAPI }: { uploadAPI: string }) {
  const [image, setImage] = useState<{
    name: string
    url: string
    size: number
  } | null>(null)
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
    image && setImage(null)
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

  const getAttachmentParts = (): MessagePart[] => {
    const parts = []
    if (image) {
      parts.push({
        type: FilePartType,
        data: {
          name: image.name,
          url: image.url,
          size: image.size,
        } as FileData,
      })
    }
    if (files.length > 0) {
      parts.push(
        ...files.map(file => ({
          type: FilePartType,
          data: {
            name: file.name,
            size: file.size,
            url: file.url,
          } as FileData,
        }))
      )
    }
    return parts
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
      return setImage({
        name: file.name,
        url: base64,
        size: file.size,
      })
    }

    // Upload any non-image file as a document
    const newDoc = await uploadContent(file, requestParams)
    return addDoc(newDoc)
  }

  return {
    image,
    setImage,
    files,
    removeDoc,
    reset,
    getAttachmentParts,
    uploadFile,
  }
}
