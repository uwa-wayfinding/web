'use client'

import { useState, useEffect, useImperativeHandle, forwardRef, useCallback } from 'react'
import {
  List,
  ListItem,
  ListItemText,
  Button,
  Chip,
  Typography,
  Box,
} from '@mui/material'
import type { File } from '@/types/file'

export interface FileListRef {
  refresh: () => void
}

const FileList = forwardRef<FileListRef>(function FileList(_, ref) {
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFiles = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/files')
      if (!response.ok) throw new Error('Failed to fetch files')
      const data = await response.json()
      setFiles(data)
    } catch (error) {
      console.error('Error fetching files:', error)
      setError('Failed to load files')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFiles()
  }, [fetchFiles])

  useImperativeHandle(ref, () => ({
    refresh: fetchFiles,
  }))

  const handleSetPublic = async (fileId: string) => {
    try {
      const response = await fetch(`/api/files/${fileId}/select`, {
        method: 'POST',
      })
      if (!response.ok) throw new Error('Failed to set file as public')
      await fetchFiles()
    } catch (error) {
      console.error('Error setting file as public:', error)
    }
  }

  const getStatusColor = (status: File['status']) => {
    switch (status) {
      case 'SUCCESS':
        return 'success'
      case 'FAILED':
        return 'error'
      case 'UPLOADING':
      case 'CONVERTING':
        return 'warning'
      default:
        return 'default'
    }
  }

  if (loading) {
    return <Typography>Loading...</Typography>
  }

  if (error) {
    return <Typography color="error">{error}</Typography>
  }

  return (
    <List>
      {files.map((file) => (
        <ListItem
          key={file.id}
          sx={{
            border: file.isPublic ? '2px solid #4caf50' : '1px solid #e0e0e0',
            borderRadius: 1,
            mb: 1,
          }}
        >
          <ListItemText
            primary={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="subtitle1" fontFamily="monospace">
                  {file.id}
                </Typography>
                <Chip
                  label={file.status}
                  color={getStatusColor(file.status)}
                  size="small"
                />
                {file.isPublic && (
                  <Chip label="Public" color="success" size="small" />
                )}
              </Box>
            }
            secondary={
              <Typography variant="body2" color="text.secondary">
                Uploaded: {new Date(file.uploadedAt).toLocaleString()}
                {file.convertedAt &&
                  ` • Converted: ${new Date(file.convertedAt).toLocaleString()}`}
              </Typography>
            }
          />
          { 
            <Button
              variant="contained"
              color="primary"
              disabled={file.status !== 'SUCCESS' || file.isPublic}
              onClick={() => handleSetPublic(file.id)}
            >
              Set as Public
            </Button>
          }
        </ListItem>
      ))}
    </List>
  )
})

export default FileList