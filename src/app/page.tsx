// Mark as a Client Component
'use client';

import React, { useState, useCallback, useRef, DragEvent, ChangeEvent } from 'react';
// Import the CSS Module
import styles from './UploadForm.module.css';

export default function UploadPage() {
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
  const resetState = () => {
    setSelectedFile(null);
    setIsDragOver(false);
    setUploadStatus('');
    setStatusType('');
    setFileId(null);
    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateFile = (file: File): boolean => {
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
  };

  // --- Event Handlers ---
  const handleFileSelected = useCallback((file: File | null) => {
    resetState();
    if (file && validateFile(file)) {
      setSelectedFile(file);
      setUploadStatus(''); // Clear previous error if valid
      setStatusType('');
    } else if (file) { // File exists but validation failed
      setSelectedFile(null);
    }
  }, []);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFileSelected(event.target.files ? event.target.files[0] : null);
  };

  const handleZoneClick = () => {
    // Clicking the label already triggers the input via htmlFor
    // So, no explicit fileInputRef.current?.click(); needed here
  };

  const handleDragOver = useCallback((event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((event: DragEvent<HTMLLabelElement>) => {
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
    setUploadStatus('Uploading...');
    setStatusType('');
    setFileId(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    const backendUploadURL = '/api/upload'; // <<< REPLACE WITH YOUR ACTUAL API ENDPOINT

    try {
      const response = await fetch(backendUploadURL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorMsg = `Upload failed: ${response.statusText} (${response.status})`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorMsg;
        } catch (e) { /* Response might not be JSON */ }
        throw new Error(errorMsg);
      }

      const result = await response.json();

      if (result.success && result.fileId) {
        setUploadStatus(result.message || 'Upload successful!');
        setStatusType('success');
        setFileId(result.fileId);
        setSelectedFile(null); // Clear selection after success
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        throw new Error(result.message || 'Upload failed: Invalid server response.');
      }

    } catch (error: any) {
      console.error("Upload Error:", error);
      setUploadStatus(`Upload failed: ${error.message}`);
      setStatusType('error');
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

  // --- JSX ---
  return (
    <div className={styles.pageWrapper}>
      {/* Header Section */}
      <header className={styles.pageHeader}>
        {/* Optional Logo: <img src="/logo.png" alt="Logo" className={styles.logo} /> */}
        <span className={styles.projectName}>UWA Wayfinding - File Upload</span>
      </header>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        {/* Introductory Text */}
        <p className={styles.introText}>
          Please upload your .dwg format wayfinding data file. The system will process it and return a file ID. Only <strong>.dwg</strong> files are accepted.
        </p>

        {/* Upload Component Container */}
        <div className={styles.uploadContainer}>
          <h2>Upload .dwg File</h2>

          {/* Hidden File Input */}
          <input
            type="file"
            id="file-input" // ID for the label's htmlFor
            ref={fileInputRef}
            accept=".dwg" // Browser hint
            onChange={handleFileChange}
            style={{ display: 'none' }}
            disabled={isUploading} // Disable input while uploading
          />

          {/* Drop Zone Label */}
          <label
            htmlFor="file-input" // Links label to the hidden input
            className={dropZoneClasses}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            // onClick is implicitly handled by htmlFor
          >
            <div className={styles.dropZone__content}>
              {/* Icon */}
              <svg className={styles.dropZone__icon} viewBox="0 0 24 24" fill="currentColor">
                 <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
              </svg>

              {/* Show filename or prompt */}
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

          {/* Progress/Uploading Indicator (Simplified) */}
          {isUploading && (
            <div className={styles.progressBarContainer}>
              <div className={styles.progressBar} style={{animation: 'pulse 1.5s infinite ease-in-out'}}>Uploading...</div>
            </div>
          )}

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className={styles.uploadButton}
          >
            {isUploading ? 'Uploading...' : 'Upload File'}
          </button>

          {/* Status Message Area */}
          {uploadStatus && (
            <div id="upload-status" className={`${styles.uploadStatus} ${statusType === 'success' ? styles.isSuccess : ''} ${statusType === 'error' ? styles.isError : ''}`}>
              {uploadStatus}
              {/* Display File ID on success */}
              {statusType === 'success' && fileId && (
                <span> File ID: {fileId}</span>
              )}
            </div>
          )}

          {/* Reset Button appears after completion (success or error) */}
          {(statusType === 'success' || statusType === 'error') && !isUploading && (
              <button onClick={resetState} className={styles.resetButton}>Upload Another File</button>
           )}

        </div> {/* End uploadContainer */}
      </main> {/* End mainContent */}

      {/* Footer Section */}
      <footer className={styles.pageFooter}>
        © {new Date().getFullYear()} UWA Wayfinding Project. All rights reserved.
      </footer>
    </div> // End pageWrapper
  );
}