import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const simulateUpload = (file, onProgress) => {
  return new Promise((resolve, reject) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      onProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        Math.random() > 0.2 ? resolve(file) : reject(file); // Simulate 80% success rate
      }
    }, 200);
  });
};

const FileItem = ({ file, progress, error }) => (
  <li className="mb-2">
    <div className="flex justify-between items-center">
      <span>{file.name}</span>
      {error ? (
        <span className="text-red-500 text-sm ml-4">Failed to upload</span>
      ) : (
        progress < 100 && <Progress value={progress} className="w-1/2 ml-4" />
      )}
    </div>
  </li>
);

const FileUpload = () => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);

  const handleFileChange = useCallback((e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter((file) =>
      ["image/jpeg", "image/png"].includes(file.type)
    );

    if (validFiles.length < selectedFiles.length) {
      setError("Only JPEG and PNG files are allowed.");
    } else {
      setError(null);
    }

    const fileObjects = validFiles.map((file) => ({
      file,
      progress: 0,
      error: null,
    }));
    setFiles((prevFiles) => [...prevFiles, ...fileObjects]);

    uploadFiles(fileObjects);
  }, []);

  const uploadFiles = (filesToUpload) => {
    filesToUpload.forEach((fileObj) => {
      simulateUpload(
        fileObj.file,
        (progress) => {
          setFiles((prevFiles) =>
            prevFiles.map((f) =>
              f.file.name === fileObj.file.name ? { ...f, progress } : f
            )
          );
        }
      )
        .then(() => {
          setFiles((prevFiles) =>
            prevFiles.map((f) =>
              f.file.name === fileObj.file.name ? { ...f, progress: 100 } : f
            )
          );
        })
        .catch(() => {
          setFiles((prevFiles) =>
            prevFiles.map((f) =>
              f.file.name === fileObj.file.name
                ? { ...f, progress: 0, error: true }
                : f
            )
          );
        });
    });
  };

  return (
    <Card className="sm:w-full w-3/4 mx-auto mt-10">
      <CardHeader>
        <CardTitle>File Uploader</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <input
          type="file"
          onChange={handleFileChange}
          multiple
          className="mb-4 file-input file-input-bordered w-full"
        />
        <ul>
          {files.map((fileObj, index) => (
            <FileItem
              key={index}
              file={fileObj.file}
              progress={fileObj.progress}
              error={fileObj.error}
            />
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
      <Button className="mt-4" onClick={() => alert("Feature not implemented")}>
        Submit All Files
      </Button>
    </div>
  );
}
