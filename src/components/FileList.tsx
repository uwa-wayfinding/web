'use client'

import { useState, useEffect } from 'react'
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

export default function FileList() {
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFiles()
  }, [])

  const fetchFiles = async () => {
    try {
      const response = await fetch('/api/files')
      if (!response.ok) throw new Error('Failed to fetch files')
      const data = await response.json()
      setFiles(data)
    } catch (error) {
      console.error('Error fetching files:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSetPublic = async (fileId: string) => {
    try {
      const response = await fetch(`/api/files/${fileId}/select`, {
        method: 'POST',
      })
      if (!response.ok) throw new Error('Failed to set file as public')
      await fetchFiles() // Refresh the list
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
                <Typography variant="subtitle1">
                  {file.originalUrl.split('/').pop()}
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
          {file.status === 'SUCCESS' && !file.isPublic && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleSetPublic(file.id)}
            >
              Set as Public
            </Button>
          )}
        </ListItem>
      ))}
    </List>
  )
} 