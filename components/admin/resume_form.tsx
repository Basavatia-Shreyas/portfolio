"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { uploadResume, getResumeMetadata } from '@/lib/database';
import { useEffect } from 'react';
import { Timestamp } from 'firebase/firestore';

export default function ResumeForm() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [currentResume, setCurrentResume] = useState<{
    url: string;
    fileName: string;
    uploadedAt: Timestamp;
    size: number;
  } | null>(null);

  useEffect(() => {
    fetchCurrentResume();
  }, []);

  const fetchCurrentResume = async () => {
    try {
      const data = await getResumeMetadata();
      setCurrentResume(data);
    } catch (error) {
      console.error('Error fetching current resume:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    
    if (selectedFile) {
      // Validate file type
      if (selectedFile.type !== 'application/pdf') {
        setError('Please select a PDF file');
        return;
      }
      
      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setSuccess('');
    setError('');

    try {
      await uploadResume(file);
      setSuccess('Resume uploaded successfully!');
      setFile(null);
      // Reset file input
      const fileInput = document.getElementById('resume-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      // Refresh current resume data
      await fetchCurrentResume();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to upload resume');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (timestamp: Timestamp) => {
    if (timestamp?.toDate) {
      return timestamp.toDate().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return 'Unknown date';
  };

  return (
    <div className="space-y-6">
      {/* Current Resume Info */}
      {currentResume && (
        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Current Resume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-zinc-300">
              <p><strong>File:</strong> {currentResume.fileName}</p>
              <p><strong>Size:</strong> {formatFileSize(currentResume.size)}</p>
              <p><strong>Uploaded:</strong> {formatDate(currentResume.uploadedAt)}</p>
              <div className="mt-4">
                <Button asChild variant="outline" className='text-black'>
                  <a href={currentResume.url} target="_blank" rel="noopener noreferrer">
                    View Current Resume
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload New Resume */}
      <Card className="bg-zinc-800 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-white">Upload New Resume</CardTitle>
          <CardDescription>
            Upload a new PDF resume. This will replace the current resume.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="resume-file" className="text-zinc-300">
                Select PDF Resume *
              </Label>
              <Input
                id="resume-file"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="bg-zinc-700 border-zinc-600 text-white file:bg-zinc-600 file:text-white file:border-0 file:mr-4 file:py-2 file:px-4 file:rounded h-full"
                required
              />
              <p className="text-xs text-zinc-400 mt-1">
                Maximum file size: 10MB. Only PDF files are accepted.
              </p>
            </div>

            {file && (
              <div className="bg-zinc-700 p-3 rounded">
                <p className="text-zinc-300 text-sm">
                  <strong>Selected:</strong> {file.name} ({formatFileSize(file.size)})
                </p>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-900/20 p-3 rounded">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            {success && (
              <div className="text-green-400 text-sm bg-green-900/20 p-3 rounded">
                {success}
              </div>
            )}

            <Button type="submit" disabled={loading || !file} className="w-full">
              {loading ? (
                <>
                  <Upload className="mr-2 h-4 w-4 animate-spin" />
                  Uploading Resume...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Resume
                </>
              )}
            </Button>
          </form>

          {currentResume && (
            <div className="mt-4 p-3 bg-amber-900/20 border border-amber-700 rounded">
              <div className="flex items-center gap-2 text-amber-400 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>
                  Uploading a new resume will permanently replace the current one.
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}