"use client";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, Github, Linkedin, Mail } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import profilecopy from "@/images/profile-copy.png";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const activeTab =
    pathname ===
    `/protected` ? "experience" : pathname.split("/").pop();

  return (
        <div className="flex flex-col items-center min-h-screen bg-zinc-900 overflow-x-hidden pt-4">
          {/* Header Section */}
          <div className="text-center">
            <div className="hidden h-px animate-glow md:block animate-fade-left bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
            <h1 className="z-10 text-4xl text-transparent duration-1000 bg-white cursor-default text-edge-outline font-display sm:text-4xl md:text-8xl whitespace-nowrap bg-clip-text">
              Shreyas Basavatia
            </h1>
            <div className="hidden h-px animate-glow md:block animate-fade-right bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
          </div>

          {/* About Section */}
          <div className="flex flex-col items-center my-8 space-y-6 md:space-y-0 md:space-x-8 md:flex-row">
            <div>
              <Image
                src={profilecopy}
                width={500}
                height={500}
                alt="Profile"
                className="rounded-full w-64 h-64 object-cover"
              />
            </div>

            <div className="max-w-md text-center md:text-left">
              <h2 className="text-3xl mb-4 font-display text-white">
                About me
              </h2>
              <p className="text-gray-300">
                Hey my name is Shreyas and I am a Computer Science student at Georgia Tech.
                I am passionate about integrating machine learning, and AI into real world applications.
              </p>
            </div>

            <div className="">
              <Card>
                <CardHeader>
                  <CardTitle className="font-display text-2xl">
                    Contact Me
                  </CardTitle>
                  <CardDescription>
                    Links to learn more about me
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul>
                    <li>
                      <a href="https://github.com/Basavatia-Shreyas">
                        <p className="hover:underline">
                          {" "}
                          <Github size={25} className="mb-2 mr-2 inline" />
                          GitHub
                        </p>
                      </a>
                    </li>
                    <li>
                      <a href="https://www.linkedin.com/in/shreyas-basavatia-936387203">
                        <p className="hover:underline">
                          {" "}
                          <Linkedin size={25} className="mb-2 mr-2 inline" />
                          LinkedIn
                        </p>
                      </a>
                    </li>
                    <li>
                      <a href="mailto:shreyasb205@gmail.com">
                        <p className="hover:underline">
                          {" "}
                          <Mail size={25} className="mb-2 mr-2 inline" />
                          Email
                        </p>
                      </a>
                    </li>
                    <li>
                      <Link href="/resume">
                        <p className="hover:underline">
                          {" "}
                          <FileText size={25} className="mb-2 mr-2 inline" />
                          Resume
                        </p>
                      </Link>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content Tabs */}
          <div className="w-full max-w-6xl px-4 mb-8">
            <Tabs
              defaultValue="experience"
              className="w-full"
              value={activeTab}
            >
              <TabsList className="w-full h-16 bg-transparent justify-start">
                <TabsTrigger
                  value="experience"
                  className="font-display text-2xl mr-4"
                >
					<Link href={`/experience`}>Experience</Link>
                </TabsTrigger>
                <TabsTrigger
                  value="projects"
                  className="font-display text-2xl mr-4"
                >
                  <Link href={`/projects`}>Projects</Link>
                </TabsTrigger>
                <TabsTrigger
                  value="publications"
                  className="font-display text-2xl mr-4"
                >
                  <Link href={`/publications`}>Publications</Link>
                </TabsTrigger>
              </TabsList>
              <Separator className="h-1 rounded-xl mt-2 mb-8" />

              <TabsContent value="experience">
                {/* <ExperiencePage /> */}
                {children}
              </TabsContent>

              <TabsContent value="projects">
                {/* <ProjectsPage /> */}
                {children}
              </TabsContent>

              <TabsContent value="publications">
                {/* <PublicationsPage /> */}
                {children}
              </TabsContent>
            </Tabs>
          </div>
        </div>
  );
}
