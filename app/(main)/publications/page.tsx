"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  ExternalLink,
  Users,
  BookOpen,
  Loader2,
} from "lucide-react";
import { usePublications } from "@/hooks/useFirestore";

export default function PublicationsPage() {
  const {
    publications,
    loading: projectsLoading,
    error: projectsError,
  } = usePublications();

  if (projectsLoading) {
    return (
      <div className="text-white text-center">
        <Loader2 className="animate-spin h-6 w-6 inline-block mr-2" />
      </div>
    );
  }

  if (projectsError) {
    return (
      <div className="text-red-400 text-center">Error: {projectsError}</div>
    );
  }

  return (
    <div className="text-white">
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-zinc-600"></div>

        <div className="space-y-8">
          {publications.map((publication) => (
            <div key={publication.id} className="relative flex items-start">
              {/* Timeline dot */}
              <div className="absolute left-6 w-4 h-4 bg-white rounded-full border-4 border-zinc-900 z-10"></div>

              {/* Content */}
              <div className="ml-16 w-full">
                <Card className="bg-zinc-800 border-zinc-700">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-white font-display text-xl mb-2">
                          {publication.name}
                        </CardTitle>
                        <CardDescription className="text-zinc-300 flex items-center gap-2 mb-2">
                          <Users size={16} />
                          {publication.authors.join(", ")}
                        </CardDescription>
                        <CardDescription className="text-zinc-300 flex items-center gap-2">
                          <BookOpen size={16} />
                          {publication.journal}
                        </CardDescription>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge
                          variant="secondary"
                          className="bg-zinc-700 text-zinc-200"
                        >
                          {publication.type}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-zinc-400">
                          <CalendarDays size={14} />
                          {publication.date
                            ? new Date(
                                publication.date.toDate()
                              ).toLocaleDateString()
                            : "Unknown Date"}
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <p className="text-zinc-300 mb-4 leading-relaxed">
                      {publication.abstract}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {publication.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="border-zinc-600 text-zinc-300"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {publication.paper_link && (
                        <a
                          href={publication.paper_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm"
                        >
                          <ExternalLink size={14} />
                          Link
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </div>

      {publications.length === 0 && (
        <div className="text-center text-zinc-400 py-12">
          No publications available at the moment.
        </div>
      )}
    </div>
  );
}
