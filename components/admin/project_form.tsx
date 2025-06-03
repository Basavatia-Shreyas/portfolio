"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { addProject } from "@/lib/database";
import { Timestamp } from "firebase/firestore";

export default function ProjectForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    date: "",
    repository: "",
    url: "",
    image: "",
    featured: false,
    status: "",
    tools: [] as string[],
    content: "",
  });
  const [newTool, setNewTool] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");

    // Validation
    if (
      !formData.title ||
      !formData.description ||
      !formData.type ||
      !formData.date ||
      !formData.status
    ) {
      setLoading(false);
      return;
    }

    try {
      type ProjectData = {
        title: string;
        description: string;
        type: string;
        date: Timestamp;
        featured: boolean;
        status: string;
        tools: string[];
        content: string;
        repository?: string;
        url?: string;
        image?: string;
      };

      const projectData: ProjectData = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        date: Timestamp.fromDate(new Date(formData.date)),
        featured: formData.featured,
        status: formData.status,
        tools: formData.tools,
        content: formData.content, // Add a default or appropriate value for 'content'
      };

      // Only add optional fields if they have values
      if (formData.repository && formData.repository.trim()) {
        projectData.repository = formData.repository.trim();
      }

      if (formData.url && formData.url.trim()) {
        projectData.url = formData.url.trim();
      }

      if (formData.image && formData.image.trim()) {
        projectData.image = formData.image.trim();
      }

      await addProject(projectData);
      setSuccess("Project added successfully!");

      // Reset form
      setFormData({
        title: "",
        description: "",
        type: "",
        date: "",
        repository: "",
        url: "",
        image: "",
        featured: false,
        status: "",
        tools: [],
        content: "",
      });
    } catch (error) {
      console.error("Error adding project:", error);
    } finally {
      setLoading(false);
    }
  };

  const addTool = () => {
    if (newTool.trim() && !formData.tools.includes(newTool.trim())) {
      setFormData((prev) => ({
        ...prev,
        tools: [...prev.tools, newTool.trim()],
      }));
      setNewTool("");
    }
  };

  const removeTool = (toolToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tools: prev.tools.filter((tool) => tool !== toolToRemove),
    }));
  };

  return (
    <Card className="bg-zinc-800 border-zinc-700">
      <CardHeader>
        <CardTitle className="text-white">Add New Project</CardTitle>
        <CardDescription>Add a new project to your portfolio</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title" className="text-zinc-300">
                Project Title
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="bg-zinc-700 border-zinc-600 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="type" className="text-zinc-300">
                Project Type
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger className="bg-zinc-700 border-zinc-600 text-white">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="group">Group</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="text-zinc-300">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="bg-zinc-700 border-zinc-600 text-white"
              placeholder="Describe your project..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date" className="text-zinc-300">
                Project Date
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, date: e.target.value }))
                }
                className="bg-zinc-700 border-zinc-600 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="status" className="text-zinc-300">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger className="bg-zinc-700 border-zinc-600 text-white">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="repository" className="text-zinc-300">
                Repository URL (optional)
              </Label>
              <Input
                id="repository"
                value={formData.repository}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    repository: e.target.value,
                  }))
                }
                className="bg-zinc-700 border-zinc-600 text-white"
                placeholder="https://github.com/..."
              />
            </div>
            <div>
              <Label htmlFor="url" className="text-zinc-300">
                Live URL (optional)
              </Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, url: e.target.value }))
                }
                className="bg-zinc-700 border-zinc-600 text-white"
                placeholder="https://..."
              />
            </div>
          </div>

          <div>
            <Label htmlFor="image" className="text-zinc-300">
              Image URL (optional)
            </Label>
            <Input
              id="image"
              value={formData.image}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, image: e.target.value }))
              }
              className="bg-zinc-700 border-zinc-600 text-white"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="flex items-center space-x-2 text-zinc-300">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    featured: e.target.checked,
                  }))
                }
                className="rounded"
              />
              <span>Featured Project</span>
            </label>
          </div>

          <div>
            <Label className="text-zinc-300">Tools/Technologies</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTool}
                onChange={(e) => setNewTool(e.target.value)}
                className="bg-zinc-700 border-zinc-600 text-white"
                placeholder="Add a tool..."
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTool())
                }
              />
              <Button type="button" onClick={addTool}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tools.map((tool) => (
                <Badge
                  key={tool}
                  variant="secondary"
                  className="bg-zinc-600 text-white"
                >
                  {tool}
                  <button
                    type="button"
                    onClick={() => removeTool(tool)}
                    className="ml-2 hover:text-red-400"
                  >
                    <X size={12} />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="content" className="text-zinc-300">
              Content
            </Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, content: e.target.value }))
              }
              className="bg-zinc-700 border-zinc-600 text-white"
              placeholder="Describe your project..."
              required
            />
          </div>

          {success && <div className="text-green-400 text-sm">{success}</div>}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Adding..." : "Add Project"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
