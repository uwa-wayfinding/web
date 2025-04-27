import type { FileStatus } from '@/prisma/client'

export interface File {
  id: string
  userId: string
  originalUrl: string
  convertedUrl: string | null
  status: FileStatus
  uploadedAt: Date
  convertedAt: Date | null
  isPublic: boolean
}

export interface FileUploadRequest {
  originalUrl: string
}

export interface FileConvertCallbackRequest {
  fileId: string
  status: FileStatus
  convertedUrl?: string
}

export interface FileSelectRequest {
  fileId: string
} 