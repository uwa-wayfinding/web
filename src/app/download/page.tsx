'use client';

import { useState } from 'react';
import { Box, Paper, TextField, Button, Typography, Alert } from '@mui/material';
import { getCloudflareContext } from '@opennextjs/cloudflare';

export default function DownloadPage() {
  const [fileId, setFileId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const R2 = getCloudflareContext().env.R2

  const handleDownload = async () => {
    if (!fileId) {
      setError('Please enter a file ID');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const object = await R2.get(fileId);
      
      if (!object) {
        throw new Error('File not found');
      }

      const blob = await object.blob();
      
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
