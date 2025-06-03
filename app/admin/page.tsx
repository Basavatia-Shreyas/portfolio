"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";
import ExperienceForm from "@/components/admin/experience_form";
import ProjectForm from "@/components/admin/project_form";
import PublicationForm from "@/components/admin/publication_form";
import ResumeForm from "@/components/admin/resume_form";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Replace with your actual password or use environment variable
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "your_admin_password";
    
    if (password === adminPassword) {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Invalid password");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-900">
        <Card className="w-full max-w-md bg-zinc-800 border-zinc-700">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-zinc-700 rounded-full flex items-center justify-center">
              <Lock className="w-6 h-6 text-zinc-300" />
            </div>
            <CardTitle className="text-white">Admin Access</CardTitle>
            <CardDescription>Enter password to access admin panel</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="password" className="text-zinc-300">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-zinc-700 border-zinc-600 text-white"
                  placeholder="Enter admin password"
                />
              </div>
              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-display text-white mb-2">Admin Panel</h1>
          <p className="text-zinc-400">Manage your portfolio content</p>
        </div>

        <Tabs defaultValue="experience" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-zinc-800">
            <TabsTrigger value="experience" className="text-white">Experience</TabsTrigger>
            <TabsTrigger value="projects" className="text-white">Projects</TabsTrigger>
            <TabsTrigger value="publications" className="text-white">Publications</TabsTrigger>
            <TabsTrigger value="resume" className="text-white">Resume</TabsTrigger>
          </TabsList>

          <TabsContent value="experience" className="mt-6">
            <ExperienceForm />
          </TabsContent>

          <TabsContent value="projects" className="mt-6">
            <ProjectForm />
          </TabsContent>

          <TabsContent value="publications" className="mt-6">
            <PublicationForm />
          </TabsContent>

          <TabsContent value="resume" className="mt-6">
            <ResumeForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}