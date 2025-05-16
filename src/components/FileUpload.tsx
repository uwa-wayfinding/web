'use client';

import { useState, useCallback, useRef } from 'react';
import styles from './UploadForm.module.css';
import ky from 'ky';

interface FileUploadProps {
  onUploadSuccess?: (fileId: string, fileName: string) => void;
  onUploadError?: (error: string) => void;
}

export default function FileUpload({ onUploadSuccess, onUploadError }: FileUploadProps) {
  // --- State Variables ---
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [statusType, setStatusType] = useState<'success' | 'error' | ''>('');
  const [fileId, setFileId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // --- Refs ---
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Helper Functions ---
  const resetState = useCallback(() => {
    setSelectedFile(null);
    setIsDragOver(false);
    setUploadStatus('');
    setStatusType('');
    setFileId(null);
    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const validateFile = useCallback((file: File): boolean => {
    if (!file) {
      setUploadStatus('No file selected.');
      setStatusType('error');
      return false;
    }
    // Strict check for .dwg extension
    const fileNameLower = file.name.toLowerCase();
    if (!fileNameLower.endsWith('.dwg')) {
      setUploadStatus('Invalid file type. Please select a .dwg file.');
      setStatusType('error');
      return false;
    }
    return true;
  }, []);

  // --- Event Handlers ---
  const handleFileSelected = useCallback((file: File | null) => {
    resetState();
    if (file && validateFile(file)) {
      setSelectedFile(file);
      setUploadStatus('');
      setStatusType('');
    } else if (file) {
      setSelectedFile(null);
    }
  }, [resetState, validateFile]);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelected(event.target.files ? event.target.files[0] : null);
  }, [handleFileSelected]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files ? event.dataTransfer.files[0] : null;
    handleFileSelected(file);
  }, [handleFileSelected]);

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus('Please select a .dwg file first.');
      setStatusType('error');
      return;
    }

    setIsUploading(true);
    setUploadStatus('Preparing upload...');
    setStatusType('');

    try {
      // Step 1: Get presigned URL
      const { file: dbFile, presignedUrl } = await ky.post('/api/files/upload', {
        json: {
          fileName: selectedFile.name,
          fileType: selectedFile.type,
        },
      }).json<{ file: { id: string }; presignedUrl: string }>();

      setFileId(dbFile.id);

      // Step 2: Upload to R2 using presigned URL
      setUploadStatus('Uploading to storage...');
      await ky.put(presignedUrl, {
        body: selectedFile,
        headers: {
          'Content-Type': selectedFile.type,
        },
      });

      // Step 3: Update file status
      await ky.patch('/api/files/upload', {
        json: {
          fileId: dbFile.id
        },
      });

      setUploadStatus('Upload successful!');
      setStatusType('success');
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      onUploadSuccess?.(dbFile.id, selectedFile.name);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Upload Error:', error);
      setUploadStatus(`Upload failed: ${errorMessage}`);
      setStatusType('error');
      onUploadError?.(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  // --- Dynamic Class Names ---
  const dropZoneClasses = [
    styles.dropZone,
    isDragOver ? styles.isDragover : '',
    selectedFile ? styles.isFileSelected : '',
    statusType === 'error' ? styles.isError : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={styles.uploadContainer}>
      <h2>Upload .dwg File</h2>

      <input
        type="file"
        id="file-input"
        ref={fileInputRef}
        accept=".dwg"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        disabled={isUploading}
      />

      <label
        htmlFor="file-input"
        className={dropZoneClasses}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className={styles.dropZone__content}>
          <svg className={styles.dropZone__icon} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" transform="translate(0, 0.5)"/>
          </svg>

          {selectedFile ? (
            <div className={styles.dropZone__fileInfo}>
              Selected file: <span className={styles.fileName}>{selectedFile.name}</span>
            </div>
          ) : (
            <p className={styles.dropZone__prompt}>
              Drag & drop your .dwg file here, or click to select
            </p>
          )}
        </div>
      </label>

      {isUploading && (
        <div className={styles.progressBarContainer}>
          <div className={styles.progressBar} style={{ animation: 'pulse 1.5s infinite ease-in-out' }}>
            Uploading...
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={handleUpload}
        disabled={!selectedFile || isUploading}
        className={styles.uploadButton}
      >
        {isUploading ? 'Uploading...' : 'Upload File'}
      </button>

      {uploadStatus && (
        <div
          id="upload-status"
          className={`${styles.uploadStatus} ${statusType === 'success' ? styles.isSuccess : ''} ${
            statusType === 'error' ? styles.isError : ''
          }`}
        >
          {uploadStatus}
          {statusType === 'success' && fileId && <span> File ID: {fileId}</span>}
        </div>
      )}

      {(statusType === 'success' || statusType === 'error') && !isUploading && (
        <button type="button" onClick={resetState} className={styles.resetButton}>
          Upload Another File
        </button>
      )}
    </div>
  );
}
