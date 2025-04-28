'use client';

import { useState, useRef } from 'react';
import type { FileListRef } from '@/components/FileList';
import {
  Container,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import FileList from '@/components/FileList';
import FileUpload from '@/components/FileUpload';

export default function Home() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileListRef = useRef<FileListRef>(null);

  const handleUploadSuccess = (fileId: string) => {
    setSuccess('File uploaded successfully!');
    console.log(`File uploaded successfully! ${fileId}`);
    setError('');
    fileListRef.current?.refresh();
  };

  const handleUploadError = (errorMessage: string) => {
    setError(errorMessage);
    setSuccess('');
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        File Management
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Upload New File
        </Typography>
        <FileUpload 
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
        />
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
      </Box>

      <Typography variant="h6" gutterBottom>
        Your Files
      </Typography>
      <FileList ref={fileListRef} />
    </Container>
  );
}
