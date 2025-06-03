"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Building, Loader2 } from "lucide-react";
import { useExperiences } from "@/hooks/useFirestore";

export default function ExperiencePage() {
  const {
    experiences,
    loading: projectsLoading,
    error: projectsError,
  } = useExperiences();
  console.log("Experiences:", experiences);

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
          {experiences.map((experience) => (
            <div key={experience.id} className="relative flex items-start">
              {/* Timeline dot */}
              <div className="absolute left-6 w-4 h-4 bg-white rounded-full border-4 border-zinc-900 z-10"></div>

              {/* Content */}
              <div className="ml-16 w-full">
                <Card className="bg-zinc-800 border-zinc-700">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-white font-display text-xl">
                          {experience.position}
                        </CardTitle>
                        <CardDescription className="text-zinc-300 flex items-center gap-2 mt-1">
                          <Building size={16} />
                          {experience.company}
                        </CardDescription>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-zinc-700 text-zinc-200"
                      >
                        {experience.position_type}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-zinc-400 mt-2">
                      <div className="flex items-center gap-1">
                        <CalendarDays size={14} />
                        {new Date(
                          experience.dates.from.toDate()
                        ).toLocaleDateString()}{" "}
                        -
                        {typeof experience.dates.to === "string"
                          ? " Present"
                          : ` ${new Date(
                              experience.dates.to.toDate()
                            ).toLocaleDateString()}`}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        {experience.location}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-zinc-300 mb-4">
                      {experience.description.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap gap-2">
                      {experience.tags.map((tech) => (
                        <Badge
                          key={tech}
                          variant="outline"
                          className="border-zinc-600 text-zinc-300"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
