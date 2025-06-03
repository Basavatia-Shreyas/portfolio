"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProjectCard from "@/components/project_card";
import { Search, Filter, Loader2 } from "lucide-react";
import { useProjects, useProjectTechnologies } from "@/hooks/useFirestore";
import { ProjectFilters } from "@/types/types";

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [techFilter, setTechFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filters: ProjectFilters = useMemo(
    () => ({
      searchTerm: searchTerm || undefined,
      type: typeFilter !== "all" ? typeFilter : undefined,
      technology: techFilter !== "all" ? techFilter : undefined,
      status: statusFilter !== "all" ? statusFilter : undefined,
    }),
    [searchTerm, typeFilter, techFilter, statusFilter]
  );

  const {
    projects,
    loading: projectsLoading,
    error: projectsError,
  } = useProjects(filters);
  const { technologies, loading: techLoading } = useProjectTechnologies();

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

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-48 bg-zinc-800 border-zinc-700 text-white">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="professional">Professional</SelectItem>
            <SelectItem value="personal">Personal</SelectItem>
            <SelectItem value="group">Group</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48 bg-zinc-800 border-zinc-700 text-white">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={techFilter}
          onValueChange={setTechFilter}
          disabled={techLoading}
        >
          <SelectTrigger className="w-48 bg-zinc-800 border-zinc-700 text-white">
            <SelectValue placeholder="Filter by technology" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Technologies</SelectItem>
            {technologies.map((tech) => (
              <SelectItem key={tech} value={tech}>
                {tech}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <div className="flex items-center gap-2 mb-6 text-zinc-400">
        <Filter size={16} />
        <span>Showing {projects.length} projects</span>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center text-zinc-400 py-12">
          No projects found matching your criteria.
        </div>
      )}
    </div>
  );
}
