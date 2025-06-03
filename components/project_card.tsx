"use client";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Project } from "@/types/types";
import { Calendar, ExternalLink, Github, Star, Clock, Code2 } from "lucide-react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

export default function ProjectCard({ project }: { project: Project }) {
  const formatDate = (timestamp: any) => {
    if (timestamp?.toDate) {
      return timestamp.toDate().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short'
      });
    }
    return 'Unknown date';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-600 text-green-100';
      case 'in-progress':
        return 'bg-blue-600 text-blue-100';
      case 'archived':
        return 'bg-gray-600 text-gray-100';
      default:
        return 'bg-zinc-600 text-zinc-100';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'professional':
        return 'bg-purple-600 text-purple-100';
      case 'personal':
        return 'bg-indigo-600 text-indigo-100';
      case 'group':
        return 'bg-blue-600 text-blue-100';
      default:
        return 'bg-zinc-600 text-zinc-100';
    }
  };

const truncateText = (text: string, maxLength: number = 120) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

const handleLinkClick = (e: React.MouseEvent, url: string) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Link href={`/${project.id}`}>
      <Card className="bg-zinc-800 border-zinc-700 overflow-hidden hover:bg-zinc-750 hover:shadow-xl hover:shadow-zinc-900/50 transition-all duration-300 cursor-pointer h-full group">
        {/* Image or Placeholder Section */}
        <div className="relative h-48 bg-gradient-to-br from-zinc-700 to-zinc-800">
          {project.image ? (
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            // Attractive placeholder when no image
            <div className="absolute inset-0 bg-zinc-700 flex items-center justify-center">
              <div className="text-center">
                <Code2 className="w-12 h-12 text-zinc-400 mx-auto mb-2" />
                <div className="text-zinc-300 font-semibold text-sm">{project.type}</div>
              </div>
            </div>
          )}
          
          {/* Overlay badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {project.featured && (
              <Badge className="bg-yellow-600 text-yellow-100 shadow-lg">
                <Star className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
            <Badge className={`${getTypeColor(project.type)} shadow-lg`}>
              {project.type}
            </Badge>
          </div>

          {/* Status badge */}
          {project.status && (
            <div className="absolute top-3 right-3">
              <Badge className={`${getStatusColor(project.status)} shadow-lg`}>
                <Clock className="w-3 h-3 mr-1" />
                {project.status}
              </Badge>
            </div>
          )}

          {/* Quick links overlay */}
          <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {project.repository && (
              <button
                onClick={(e) => handleLinkClick(e, project.repository!)}
                className="bg-black/70 rounded-full p-2 backdrop-blur-sm hover:bg-black/90 transition-colors"
                title="View Source Code"
              >
                <GitHubLogoIcon className="w-4 h-4 text-white" />
              </button>
            )}
            {project.url && (
              <button
                onClick={(e) => handleLinkClick(e, project.url!)}
                className="bg-black/70 rounded-full p-2 backdrop-blur-sm hover:bg-black/90 transition-colors"
                title="View Live Demo"
              >
                <ExternalLink className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
        </div>

        {/* Content Section */}
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-white text-lg line-clamp-2 group-hover:text-blue-400 transition-colors">
              {project.title}
            </CardTitle>
          </div>
          
          <div className="flex items-center gap-3 text-zinc-400 text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(project.date)}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0 space-y-4">
          {/* Description */}
          <p className="text-zinc-300 text-sm line-clamp-3 leading-relaxed">
            {truncateText(project.description, 120)}
          </p>
          
          {/* Technologies */}
          <div>
            <div className="text-zinc-400 text-xs font-medium mb-2 uppercase tracking-wide">
              Technologies
            </div>
            <div className="flex flex-wrap gap-1">
              {project.tools.slice(0, 2).map((tool) => (
                <Badge 
                  key={tool} 
                  variant="outline" 
                  className="text-xs border-zinc-600 text-zinc-400 bg-zinc-800/50"
                >
                  {tool}
                </Badge>
              ))}
              {project.tools.length > 2 && (
                <Badge 
                  variant="outline" 
                  className="text-xs border-zinc-600 text-zinc-400 bg-zinc-800/50"
                >
                  +{project.tools.length - 2} more
                </Badge>
              )}
            </div>
          </div>
          
          {/* Footer with links */}
          <div className="flex items-center justify-between pt-2 border-t border-zinc-700">
            <div className="flex gap-3">
              {project.repository && (
                <div className="flex items-center gap-1 text-zinc-400 text-xs">
                  <Github className="w-3 h-3" />
                  <span>Source</span>
                </div>
              )}
              {project.url && (
                <div className="flex items-center gap-1 text-zinc-400 text-xs">
                  <ExternalLink className="w-3 h-3" />
                  <span>Demo</span>
                </div>
              )}
            </div>
            
            <div className="text-zinc-500 text-xs">
              Click to view
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}