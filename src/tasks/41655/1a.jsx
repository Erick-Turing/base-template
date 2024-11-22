import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const FileUpload = () => {
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  const handleFileChange = useCallback((e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter(file => ['image/jpeg', 'image/png'].includes(file.type));

    if (validFiles.length < selectedFiles.length) {
      setError('Only JPEG and PNG files are allowed.');
      return;
    }

    setError(null);
    setFiles(validFiles);
    uploadFiles(validFiles);
  }, []);

  const uploadFiles = (filesToUpload) => {
    let uploaded = 0;
    const total = filesToUpload.length;

    const simulateUpload = (file) => {
      return new Promise((resolve) => {
        const fakeProgress = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 100) {
              clearInterval(fakeProgress);
              resolve(file);
              return 100;
            }
            return Math.min(prev + 10, 100);
          });
        }, 200);
      });
    };

    filesToUpload.forEach(file => {
      simulateUpload(file).then((uploadedFile) => {
        uploaded++;
        if (uploaded === total) {
          setFiles(prevFiles => [...prevFiles, ...filesToUpload]);
          setUploadProgress(0);
        }
      }).catch(() => {
        setError(`Failed to upload ${file.name}`);
        setUploadProgress(0);
      });
    });
  };

  return (
    <Card className="sm:w-full w-3/4 mx-auto mt-10">
      <CardHeader>
        <CardTitle>File Uploader</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>}
        <input 
          type="file" 
          onChange={handleFileChange} 
          multiple 
          className="mb-4 file-input file-input-bordered w-full"
        />
        {uploadProgress > 0 && <Progress value={uploadProgress} className="mb-4" />}
        <ul>
          {files.map((file, index) => (
            <li key={index} className="list-disc ml-5">{file.name}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100">
      <FileUpload />
      <Button className="mt-4" onClick={() => alert('Feature not implemented')}>Submit All Files</Button>
    </div>
  );
}