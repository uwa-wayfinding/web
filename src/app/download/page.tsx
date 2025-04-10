'use client';

import { useState } from 'react';
import { Box, Paper, TextField, Button, Typography, Alert } from '@mui/material';

export default function DownloadPage() {
  const [fileId, setFileId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    if (!fileId) {
      setError('Please enter a file ID');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const fileUrl = `https://pub-8d29e550a8894f6db459c5af871b7a4e.r2.dev/${fileId}`; // using either '241-01.dwg' or '241-GN.DWG' for test
      const response = await fetch(fileUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/octet-stream',
          'Origin': window.location.origin,
        },
        mode: 'cors',
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Download failed:', {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          error: errorText
        });
        throw new Error(`Failed to download file: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();
      
      if (blob.size === 0) {
        throw new Error('Downloaded file is empty');
      }
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileId;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Download error:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Download Converted File
        </Typography>
        
        <TextField
          fullWidth
          label="File ID"
          value={fileId}
          onChange={(e) => setFileId(e.target.value)}
          margin="normal"
          variant="outlined"
          placeholder="e.g., 241-01.dwg"
        />
        <Button
          fullWidth
          variant="contained"
          onClick={handleDownload}
          disabled={isLoading}
          sx={{ mt: 2 }}
        >
          {isLoading ? 'Downloading...' : 'Download'}
        </Button>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Paper>
    </Box>
  );
}
