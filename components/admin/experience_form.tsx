"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { addExperience } from "@/lib/database";
import { Timestamp } from "firebase/firestore";

export default function ExperienceForm() {
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    location: "",
    fromDate: "",
    toDate: "",
    isCurrentRole: false,
    position_type: "",
    description: [""],
    tags: [] as string[],
  });
  const [newTag, setNewTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");

    try {
      const experienceData = {
        company: formData.company,
        position: formData.position,
        location: formData.location,
        dates: {
          from: Timestamp.fromDate(new Date(formData.fromDate)),
          to: formData.isCurrentRole ? "present" : Timestamp.fromDate(new Date(formData.toDate))
        },
        description: formData.description.filter(desc => desc.trim() !== ""),
        tags: formData.tags,
        position_type: formData.position_type,
      };

      await addExperience(experienceData);
      setSuccess("Experience added successfully!");
      
      // Reset form
      setFormData({
        company: "",
        position: "",
        location: "",
        fromDate: "",
        toDate: "",
        isCurrentRole: false,
        position_type: "",
        description: [""],
        tags: [],
      });
    } catch (error) {
      console.error("Error adding experience:", error);
    } finally {
      setLoading(false);
    }
  };

  const addDescriptionField = () => {
    setFormData(prev => ({
      ...prev,
      description: [...prev.description, ""]
    }));
  };

  const updateDescription = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      description: prev.description.map((desc, i) => i === index ? value : desc)
    }));
  };

  const removeDescription = (index: number) => {
    setFormData(prev => ({
      ...prev,
      description: prev.description.filter((_, i) => i !== index)
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <Card className="bg-zinc-800 border-zinc-700">
      <CardHeader>
        <CardTitle className="text-white">Add New Experience</CardTitle>
        <CardDescription>Add a new work experience entry</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company" className="text-zinc-300">Company</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                className="bg-zinc-700 border-zinc-600 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="position" className="text-zinc-300">Position</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                className="bg-zinc-700 border-zinc-600 text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location" className="text-zinc-300">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="bg-zinc-700 border-zinc-600 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="position_type" className="text-zinc-300">Position Type</Label>
              <Select value={formData.position_type} onValueChange={(value) => setFormData(prev => ({ ...prev, position_type: value }))}>
                <SelectTrigger className="bg-zinc-700 border-zinc-600 text-white">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="internship">Internship</SelectItem>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fromDate" className="text-zinc-300">Start Date</Label>
              <Input
                id="fromDate"
                type="date"
                value={formData.fromDate}
                onChange={(e) => setFormData(prev => ({ ...prev, fromDate: e.target.value }))}
                className="bg-zinc-700 border-zinc-600 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="toDate" className="text-zinc-300">End Date</Label>
              <div className="space-y-2">
                <Input
                  id="toDate"
                  type="date"
                  value={formData.toDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, toDate: e.target.value }))}
                  className="bg-zinc-700 border-zinc-600 text-white"
                  disabled={formData.isCurrentRole}
                  required={!formData.isCurrentRole}
                />
                <label className="flex items-center space-x-2 text-zinc-300">
                  <input
                    type="checkbox"
                    checked={formData.isCurrentRole}
                    onChange={(e) => setFormData(prev => ({ ...prev, isCurrentRole: e.target.checked }))}
                    className="rounded"
                  />
                  <span>Current Role</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <Label className="text-zinc-300">Description</Label>
            {formData.description.map((desc, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Textarea
                  value={desc}
                  onChange={(e) => updateDescription(index, e.target.value)}
                  className="bg-zinc-700 border-zinc-600 text-white"
                  placeholder="Describe your responsibilities..."
                />
                {formData.description.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeDescription(index)}
                    className="mt-1"
                  >
                    <X size={16} />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addDescriptionField} className="mt-2">
              <Plus size={16} className="mr-2" />
              Add Description
            </Button>
          </div>

          <div>
            <Label className="text-zinc-300">Tags/Technologies</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="bg-zinc-700 border-zinc-600 text-white"
                placeholder="Add a tag..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-zinc-600 text-white">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 hover:text-red-400"
                  >
                    <X size={12} />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {success && (
            <div className="text-green-400 text-sm">{success}</div>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Adding..." : "Add Experience"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}