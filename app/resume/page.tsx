"use client";

import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, ZoomIn, ZoomOut, RotateCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { getResumeMetadata } from "@/lib/database";
import Link from "next/link";

// Set up PDF.js worker
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

export default function ResumePage() {
  const router = useRouter();
  const [resumeData, setResumeData] = useState<{
    url: string;
    fileName: string;
    uploadedAt: any;
    size: number;
  } | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      setLoading(true);
      const data = await getResumeMetadata();
      if (data) {
        setResumeData(data);
      } else {
        setError("No resume found");
      }
    } catch (err) {
      setError("Failed to load resume");
      console.error("Error loading resume:", err);
    } finally {
      setLoading(false);
    }
  };

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (timestamp: any) => {
    if (timestamp?.toDate) {
      return timestamp.toDate().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    return "Unknown date";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading resume...</p>
        </div>
      </div>
    );
  }

  if (error || !resumeData) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center h-full">
        <Card className="bg-zinc-800 border-zinc-700 max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-semibold text-white mb-4">
              Resume Not Available
            </h2>
            <p className="text-zinc-400 mb-4">
              {error || "No resume has been uploaded yet."}
            </p>
            <Button
              onClick={() => router.push("/experience")}
              variant="outline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-zinc-900 flex flex-col">
    {/* Header */}
    <div className="sticky top-0 z-10 bg-zinc-900/95 backdrop-blur border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.back()}
              variant="ghost"
              className="text-zinc-400 hover:text-black"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-white">Resume</h1>
              <p className="text-sm text-zinc-400">
                {resumeData.fileName} • {formatFileSize(resumeData.size)} •
                Updated {formatDate(resumeData.uploadedAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={resumeData.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>

    {/* PDF Embed - Takes remaining height */}
    <div className="w-full h-screen">
      <iframe 
        src={resumeData.url} 
        className="w-full h-full border-0" 
      />
    </div>
    {/* <div className="flex-1 overflow-hidden min-h-max">
      <embed
        src={resumeData.url}
        className="w-full h-full"
        type="application/pdf"
      />
    </div> */}
  </div>
);
}
