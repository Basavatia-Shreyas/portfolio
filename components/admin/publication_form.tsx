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
import { addPublication } from "@/lib/database";
import { Timestamp } from "firebase/firestore";

export default function PublicationForm() {
  const [formData, setFormData] = useState({
    name: "",
    journal: "",
    date: "",
    abstract: "",
    paper_link: "",
    type: "",
    authors: [""],
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
      const publicationData = {
        name: formData.name,
        authors: formData.authors.filter(author => author.trim() !== ""),
        journal: formData.journal,
        date: Timestamp.fromDate(new Date(formData.date)),
        abstract: formData.abstract,
        paper_link: formData.paper_link || undefined,
        type: formData.type,
        tags: formData.tags,
      };

      await addPublication(publicationData);
      setSuccess("Publication added successfully!");
      
      // Reset form
      setFormData({
        name: "",
        journal: "",
        date: "",
        abstract: "",
        paper_link: "",
        type: "",
        authors: [""],
        tags: [],
      });
    } catch (error) {
      console.error("Error adding publication:", error);
    } finally {
      setLoading(false);
    }
  };

  const addAuthor = () => {
    setFormData(prev => ({
      ...prev,
      authors: [...prev.authors, ""]
    }));
  };

  const updateAuthor = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      authors: prev.authors.map((author, i) => i === index ? value : author)
    }));
  };

  const removeAuthor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      authors: prev.authors.filter((_, i) => i !== index)
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
        <CardTitle className="text-white">Add New Publication</CardTitle>
        <CardDescription>Add a new publication to your portfolio</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name" className="text-zinc-300">Publication Title</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="bg-zinc-700 border-zinc-600 text-white"
              required
            />
          </div>

          <div>
            <Label className="text-zinc-300">Authors</Label>
            {formData.authors.map((author, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  value={author}
                  onChange={(e) => updateAuthor(index, e.target.value)}
                  className="bg-zinc-700 border-zinc-600 text-white"
                  placeholder="Author name..."
                />
                {formData.authors.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeAuthor(index)}
                  >
                    <X size={16} />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addAuthor} className="mt-2">
              <Plus size={16} className="mr-2" />
              Add Author
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="journal" className="text-zinc-300">Journal/Conference</Label>
              <Input
                id="journal"
                value={formData.journal}
                onChange={(e) => setFormData(prev => ({ ...prev, journal: e.target.value }))}
                className="bg-zinc-700 border-zinc-600 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="type" className="text-zinc-300">Publication Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger className="bg-zinc-700 border-zinc-600 text-white">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="journal">Journal</SelectItem>
                  <SelectItem value="conference">Conference</SelectItem>
                  <SelectItem value="preprint">Preprint</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="date" className="text-zinc-300">Publication Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="bg-zinc-700 border-zinc-600 text-white"
              required
            />
          </div>

          <div>
            <Label htmlFor="abstract" className="text-zinc-300">Abstract</Label>
            <Textarea
              id="abstract"
              value={formData.abstract}
              onChange={(e) => setFormData(prev => ({ ...prev, abstract: e.target.value }))}
              className="bg-zinc-700 border-zinc-600 text-white"
              placeholder="Publication abstract..."
              rows={4}
              required
            />
          </div>

          <div>
            <Label htmlFor="paper_link" className="text-zinc-300">Paper Link (optional)</Label>
            <Input
              id="paper_link"
              value={formData.paper_link}
              onChange={(e) => setFormData(prev => ({ ...prev, paper_link: e.target.value }))}
              className="bg-zinc-700 border-zinc-600 text-white"
              placeholder="https://..."
            />
          </div>

          <div>
            <Label className="text-zinc-300">Tags</Label>
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
            {loading ? "Adding..." : "Add Publication"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}