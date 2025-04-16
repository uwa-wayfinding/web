'use client';
import { useState } from 'react';

export default function UploadPage() {
  const [message, setMessage] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.file as unknown as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    type UploadResponse = {
      message: string;
      key?: string;
      url?: string;
      error?: string;
    };

    const result: UploadResponse = await res.json();

    if (res.ok) {
      setMessage("✅ Upload Successful!");
      setDownloadUrl(result.url ?? "");
    } else {
      setMessage(`❌ Error: ${result.message}`);
    }
  };


  return (
    <main style={{ padding: "2rem" }}>
      <h1>Upload DWG File</h1>
      <form onSubmit={handleUpload}>
        <input type="file" name="file" accept=".dwg" required />
        <button type="submit">Upload</button>
      </form>
      {message && <p>{message}</p>}
      {downloadUrl && (
        <p>
          File URL: <a href={downloadUrl} target="_blank" rel="noopener noreferrer">{downloadUrl}</a>
        </p>
      )}
    </main>
  );
}
