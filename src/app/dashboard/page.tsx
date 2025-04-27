'use client';

import { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  TextField,
  Alert,
} from '@mui/material';
import FileList from '@/components/FileList';

export default function Home() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleUpload = async () => {
    try {
      const response = await fetch('/api/files/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ originalUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      setOriginalUrl('');
      setSuccess('File uploaded successfully!');
      setError('');
    } catch (error) {
      console.error(error);
      setError('Failed to upload file. Please try again.');
      setSuccess('');
    }
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
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            label="File URL"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            placeholder="Enter the URL of the file to upload"
          />
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={!originalUrl}
          >
            Upload
          </Button>
        </Box>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
      </Box>

      <Typography variant="h6" gutterBottom>
        Your Files
      </Typography>
      <FileList />
    </Container>
  );
}
