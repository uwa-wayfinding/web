'use client';

import { useState, useRef } from 'react';
import type { FileListRef } from '@/components/FileList';
import { authClient, useSession } from "@/lib/auth-client"
import {
  Container,
  Typography,
  Box,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
  TextField,
} from '@mui/material';
import FileList from '@/components/FileList';
import FileUpload from '@/components/FileUpload';

export default function Home() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileListRef = useRef<FileListRef>(null);
  const { data: session } = useSession();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [fileDescription, setFileDescription] = useState('');
  const [emailText, setEmailText] = useState('');
  const [emailStatus, setEmailStatus] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isSendingCooldown, setIsSendingCooldown] = useState(false);

  const handleUploadSuccess = (fileId: string, fileName: string) => {
    setSuccess('File uploaded successfully!');
    console.log(`File uploaded successfully! ${fileId}`);
    setError('');
    fileListRef.current?.refresh();
    setUploadedFileName(fileName);
    popUpSendNotification();
  };

  const handleSendEmail_to_uploader = async (e?: React.FormEvent) => {
    if (isSendingCooldown) return;
    
    try {
      if (e) {
        e.preventDefault();
      }

      // prepare email content
      // HTML template
      let emailHTML = '';
      if (fileDescription.length > 0) {
        emailHTML = `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="color: #007BFF; text-align: center;">UWA-Wayfinding System: Thank you for uploading file</h2>
            <p>Dear ${session?.user?.name},</p>
            <footer style="margin-top: 30px; text-align: left; font-size: 14px; color: #333;">
              <p>File Name: <strong>${uploadedFileName}</strong></p>
              <p>Here's your content of map description:</p>
              <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; white-space: pre-line;">
                ${fileDescription.replace(/\n/g, '<br>')}
              </div>
              <p>Thank you for your help in uploading more maps for UWA-Wayfinding System.</p>
              <p>We will try to update it into map after verifying the file.</p>
              <p style="text-align: center; color: #888; font-size: 12px; margin-top: 20px;">&copy; 2025 Wayfinding Web</p>
            </footer>
          </div>
        `;
      }
      else{
        emailHTML = `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="color: #007BFF; text-align: center;">UWA-Wayfinding System: Thank you for uploading file</h2>
            <p>Dear ${session?.user?.name},</p>
            <footer style="margin-top: 30px; text-align: left; font-size: 14px; color: #333;">
              <p>File Name: <strong>${uploadedFileName}</strong></p>
              <p>Thank you for your help in uploading more maps for UWA-Wayfinding System.</p>
              <p>We will try to update it into map after verifying the file.</p>
              <p style="text-align: center; color: #888; font-size: 12px; margin-top: 20px;">&copy; 2025 Wayfinding Web</p>
            </footer>
          </div>
        `;
      }

      // 发送POST请求
      const response = await fetch('/api/files/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: emailHTML,
          fileName: uploadedFileName
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      // 处理成功响应
      setSuccess('Email sent successfully!');
      handleCloseDialog();

      // 3秒后清除成功消息
      setTimeout(() => {
        setSuccess('');
      }, 3000);

    } catch (error) {
      console.error('Error sending email:', error);
      setError('Failed to send email. Please try again.');
    } finally {
      // 8秒后重置冷却状态
      setTimeout(() => {
        setIsSendingCooldown(false);
      }, 8000);
    }
  };

  const handleSendEmail_to_official = async (e?: React.FormEvent) => {
    try {
      if (e) {
        e.preventDefault();
      }
      
      let emailHTML = '';
      if (fileDescription.length > 0) {
        emailHTML = `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="color: #007BFF; text-align: center;">New File Upload Notification</h2>
            <p>A new file has been uploaded to the UWA-Wayfinding System.</p>
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
              <p>File Name: <strong>${uploadedFileName}</strong></p>
              <p>Uploaded by: ${session?.user?.name}</p>
              <p>Description:</p>
              <div style="background-color: #fff; padding: 10px; border-radius: 3px;">
                ${fileDescription.replace(/\n/g, '<br>')}
              </div>
            </div>
            <p>Please review the uploaded file at your earliest convenience.</p>
          </div>
        `;
      }
      else{
        emailHTML = `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="color: #007BFF; text-align: center;">New File Upload Notification</h2>
            <p>A new file has been uploaded to the UWA-Wayfinding System.</p>
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
              <p>File Name: <strong>${uploadedFileName}</strong></p>
              <p>Uploaded by: ${session?.user?.name}</p>
              <p></p>
            </div>
            <p>Please review the uploaded file at your earliest convenience.</p>
          </div>
        `;
      }
      const response = await fetch('/api/files/dashboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: emailHTML,
          fileName: uploadedFileName
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send notification email to official');
      }
    } catch (error) {
      console.error('Error sending email to official:', error);
      setError('Failed to send notification email to official. Please try again.');
    }
  };

  const popUpSendNotification = () => {
    setIsDialogOpen(true);
    setFileDescription(''); // 重置文件描述
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setFileDescription('');
  };

  const handleUploadError = (errorMessage: string) => {
    setError(errorMessage);
    setSuccess('');
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
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
      <div style={{ fontSize: '15px', color: 'Crimson', marginBottom: '20px' }} onClick={popUpSendNotification}>You should send an email as description for your file to <b>uwawayfinder@gmail.com</b> once you uploaded</div>
      <Typography variant="h6" gutterBottom>
        Your Files
      </Typography>
      <FileList ref={fileListRef} />

      {/* 文件描述弹窗 */}
      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: 2,
          bgcolor: 'primary.main',
          color: 'white'
        }}>
          <Avatar 
            src={session?.user?.image || ''} 
            alt={session?.user?.name || 'User'}
            sx={{ width: 40, height: 40 }}
          />
          Upload Description
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Dear {session?.user?.name || 'User'}, please describe the DWG file you just uploaded:
          </Typography>
          {uploadedFileName && (
            <Typography variant="subtitle2" color="primary" gutterBottom>
              File Name: {uploadedFileName}
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mt: 1 }}>
            For example:
            Building Name, Building Type, Building Address, Building Region, Building Floors, Building open time and close time, 
            Layers of drawing included:
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="File Description"
            fullWidth
            multiline
            rows={4}
            value={fileDescription}
            onChange={(e) => setFileDescription(e.target.value)}
            placeholder="Please enter the details of your file..."
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ 
          p: 2, 
          bgcolor: 'background.paper',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <Button 
            onClick={handleCloseDialog}
            variant="outlined"
            color="primary"
          >
            DO NOT SEND
          </Button>
          <Button 
            onClick={()=>{handleSendEmail_to_uploader(); handleSendEmail_to_official()}}
            variant="contained" 
            color="primary"
            disabled={!fileDescription.trim() || isSendingCooldown}
          >
            {isSendingCooldown ? 'Sending...' : 'Send E-mail'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

