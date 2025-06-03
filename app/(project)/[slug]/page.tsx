"use client";

import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  Calendar,
  Tag,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { useProject } from "@/hooks/useFirestore";
import Image from "next/image";
import Link from "next/link";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Timestamp } from "firebase/firestore";

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const { project, loading, error } = useProject(slug);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading project...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Project Not Found
          </h1>
          <p className="text-zinc-400 mb-6">
            {error || "The project you're looking for doesn't exist."}
          </p>
          <Button onClick={() => router.push("/projects")} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (timestamp: Timestamp) => {
    if (timestamp?.toDate) {
      return timestamp.toDate().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    return "Unknown date";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-600 text-green-100";
      case "in-progress":
        return "bg-blue-600 text-blue-100";
      case "archived":
        return "bg-gray-600 text-gray-100";
      default:
        return "bg-zinc-600 text-zinc-100";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "professional":
        return "bg-purple-600 text-purple-100";
      case "personal":
        return "bg-indigo-600 text-indigo-100";
      case "group":
        return "bg-blue-600 text-blue-100";
      default:
        return "bg-zinc-600 text-zinc-100";
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900">
      {/* Project Hero */}
      <div className="mb-8">
        {/* Header with back button */}
        <div className="sticky top-0 z-10 bg-zinc-900/95 backdrop-blur border-b border-zinc-800">
          <div className="w-full mx-auto px-6 py-4">
            <Button
              onClick={() => router.push("/projects")}
              variant="ghost"
              className="text-zinc-400 hover:text-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Button>
          </div>
        </div>

        {/* Hero Image Section - Full Width */}
        {project.image && (
          <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden">
            <Image
              src={project.image}
              alt={project.title}
              fill
              priority
              className="object-cover object-top"
              sizes="100vw"
            />
            {/* Gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/50 to-transparent" />

            {/* Project title overlay on image */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
              <div className="max-w-7xl mx-auto flex justify-between items-end">
                <div className="flex-1">
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-display text-white mb-4 drop-shadow-2xl">
                    {project.title}
                  </h1>
                  <p className="text-lg md:text-xl text-zinc-200 leading-relaxed max-w-3xl drop-shadow-lg">
                    {project.description}
                  </p>
                </div>

                {/* Action buttons overlay */}
                <div className="flex gap-3 ml-6">
                  {project.repository && (
                    <Link
                      href={project.repository}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="secondary"
                        size="sm"
                        className="bg-white/90 text-zinc-900 hover:bg-grey-100 backdrop-blur"
                      >
                        <GitHubLogoIcon className="mr-2 h-4 w-4" />
                        Code
                      </Button>
                    </Link>
                  )}
                  {project.url && (
                    <Link
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        size="sm"
                        className="bg-white/90 text-zinc-900 hover:bg-grey-100 backdrop-blur"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Link
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div>
            {!project.image && (
              <div className="mb-8">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                  <div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-display text-white mb-4">
                      {project.title}
                    </h1>
                    <p className="text-xl text-zinc-300 leading-relaxed max-w-4xl">
                      {project.description}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    {project.repository && (
                      <Link
                        href={project.repository}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" size="sm">
                          <GitHubLogoIcon className="mr-2 h-4 w-4" />
                          Code
                        </Button>
                      </Link>
                    )}
                    {project.url && (
                      <Link
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button size="sm">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Live Demo
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Project Meta Information */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center text-zinc-400">
                <Calendar className="mr-2 h-4 w-4" />
                <span>{formatDate(project.date)}</span>
              </div>

              <Badge className={getTypeColor(project.type)}>
                <Tag className="mr-1 h-3 w-3" />
                {project.type}
              </Badge>

              {project.status && (
                <Badge className={getStatusColor(project.status)}>
                  <Clock className="mr-1 h-3 w-3" />
                  {project.status}
                </Badge>
              )}

              {project.featured && (
                <Badge className="bg-yellow-600 text-yellow-100">
                  ⭐ Featured
                </Badge>
              )}
            </div>

            {/* Technologies */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-3">
                Technologies Used
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tools.map((tool) => (
                  <Badge
                    key={tool}
                    variant="secondary"
                    className="bg-zinc-700 text-zinc-200"
                  >
                    {tool}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <Separator className="mb-8" />

          {/* Project Content */}
          {project.content ? (
            <div className="prose prose-invert prose-zinc max-w-none markdown-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-3xl font-display text-white mb-6 mt-8">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-display text-white mb-4 mt-6">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-semibold text-white mb-3 mt-5">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-zinc-300 mb-4 leading-relaxed">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-outside text-zinc-300 mb-4 space-y-1">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-outside text-zinc-300 mb-4 space-y-1">
                      {children}
                    </ol>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-zinc-600 pl-4 italic text-zinc-400 my-4">
                      {children}
                    </blockquote>
                  ),
                  code: ({ node, children, ...props }) =>
                    node && "inline" in node && (node as { inline?: boolean }).inline ? (
                      <code
                        className="bg-zinc-800 text-zinc-200 px-1 py-0.5 rounded text-sm"
                        {...props}
                      >
                        {children}
                      </code>
                    ) : (
                      <code
                        className="block bg-zinc-800 text-zinc-200 p-4 rounded-lg overflow-x-auto"
                        {...props}
                      >
                        {children}
                      </code>
                    ),
                  pre: ({ children }) => (
                    <div className="bg-zinc-800 rounded-lg overflow-hidden mb-4">
                      <pre className="p-4 overflow-x-auto">{children}</pre>
                    </div>
                  ),
                  a: ({ href, children }) => (
                    <Link
                      href={href || "#"}
                      className="text-blue-400 hover:text-blue-300 underline"
                      target={href?.startsWith("http") ? "_blank" : undefined}
                      rel={
                        href?.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                    >
                      {children}
                    </Link>
                  ),
                  img: ({ src, alt }) => (
                    <div className="my-6">
                      <Image
                        src={src || ""}
                        alt={alt || ""}
                        width={800}
                        height={400}
                        className="rounded-lg"
                      />
                    </div>
                  ),
                }}
              >
                {project.content}
              </ReactMarkdown>
            </div>
          ) : (
            <Card className="bg-zinc-800 border-zinc-700">
              <CardContent className="pt-6">
                <p className="text-zinc-400 text-center">
                  No detailed content available for this project.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
