import React, { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { X } from "lucide-react";

const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "application/pdf"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const FileUploader = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const validFiles = selectedFiles.filter(
      (file) => ALLOWED_FILE_TYPES.includes(file.type) && file.size <= MAX_FILE_SIZE
    );

    if (validFiles.length !== selectedFiles.length) {
      setError("Some files were rejected. Please check file types and sizes.");
    } else {
      setError(null);
    }

    setFiles((prevFiles) => [...prevFiles, ...validFiles]);
  };

  const uploadFiles = useCallback(() => {
    setUploading(true);
    setProgress(0);

    const uploadPromises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "https://example.com/upload");
        xhr.setRequestHeader("Content-Type", file.type);

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            setProgress((prevProgress) => Math.max(prevProgress, percentComplete));
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200) {
            resolve(file);
          } else {
            reject(new Error(`Upload failed for ${file.name}`));
          }
        };

        xhr.onerror = () => reject(new Error(`Network error during upload of ${file.name}`));

        xhr.send(file);
      });
    });

    Promise.all(uploadPromises)
      .then(() => {
        setUploading(false);
        setProgress(100);
      })
      .catch((error) => {
        setUploading(false);
        setError(error.message);
      });
  }, [files]);

  const removeFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>File Uploader</CardTitle>
        <CardDescription>Upload your files here</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <input
            type="file"
            onChange={handleFileChange}
            multiple
            accept={ALLOWED_FILE_TYPES.join(",")}
            className="w-full p-2 border rounded"
          />
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {files.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">Selected Files:</h3>
              <ul className="list-disc pl-5">
                {files.map((file, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <span>{file.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="text-red-500"
                    >
                      <X size={16} />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {uploading && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-gray-500 text-center">{Math.round(progress)}% uploaded</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={uploadFiles} disabled={files.length === 0 || uploading} className="w-full">
          {uploading ? "Uploading..." : "Upload Files"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <FileUploader />
    </div>
  );
}