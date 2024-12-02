import Image from "next/image";
import profilecopy from "../images/profile-copy.png"
import ProjectCard from "./components/project_card";
//import { allProjects } from "contentlayer/generated";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import { Github, Mail, Linkedin, FileText } from "lucide-react";
import getPostMetaData from "@/utils/getPostMetadata";


export default function Home() {
  //const sorted = require("./content.json");
  const postMetadata = getPostMetaData("projects")
  const sortedMetadata = postMetadata.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const professional = sortedMetadata.filter((project) => project.type === "professional")

  const personal = sortedMetadata.filter((project) => project.type === "personal")
  const group = sortedMetadata.filter((project) => project.type === "group")
  //console.log(postMetadata);

  return (
  <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-900 overflow-x-hidden">
    <div className="text-center">
	    <div className="hidden h-px animate-glow md:block animate-fade-left bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
	    <h1 className="z-10 text-4xl text-transparent duration-1000 bg-white cursor-default text-edge-outline font-display sm:text-4xl md:text-8xl whitespace-nowrap bg-clip-text">
				Shreyas Basavatia
			</h1>

				<div className="hidden h-px animate-glow md:block animate-fade-right bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
    </div>

    <div className="flex flex-col items-center mt-10 space-y-6 md:space-y-0 md:space-x-8 md:flex-row">
      <div>
        <Image src={profilecopy} width={500} height={500} alt="Profile" className="rounded-full w-64 h-64 object-cover"/>
      </div>

      <div className="max-w-md text-center md:text-left">
        <h2 className="text-3xl mb-4 font-display text-white">About me</h2>
        <p className="text-gray-300">
          I am a student at Georgia Tech pursuing my bachelor of science in computer science. I am passionate about advancing natural language processing and machine learning technologies and would like to further integrate them into everyday life. I am also interested in web development through the full stack projects I have created.
        </p>
      </div>
      <div className="">
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-2xl">Contact Me</CardTitle>
          <CardDescription>Links to learn more about me</CardDescription>
        </CardHeader>
        <CardContent>
          <ul>
            <li>
              <a href="https://github.com/Basavatia-Shreyas">
                <p className="hover:underline"> <Github size={25} className="mb-2 mr-2 inline"/>GitHub</p>
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com/in/shreyas-basavatia-936387203">
                <p className="hover:underline"> <Linkedin size={25} className="mb-2 mr-2 inline"/>LinkedIn</p>
              </a>
            </li>
            <li>
              <a href="mailto:shreyasb205@gmail.com">
                <p className="hover:underline"> <Mail size={25} className="mb-2 mr-2 inline"/>Email</p>
              </a>
            </li>
            <li>
              <a href="https://olive-carmita-88.tiiny.site">
                <p className="hover:underline"> <FileText size={25} className="mb-2 mr-2 inline"/>Resume</p>
              </a>
            </li>
          </ul>
        </CardContent>
      </Card>
      </div>
    </div>

    <div className="w-full max-w-4xl mt-16 text-white">
    <h1 className="text-3xl font-display mb-5 ml-1">
      My Projects
    </h1>

    <Tabs defaultValue="professional">
      <TabsList className="w-1028 h-16 bg-transparent">
        <TabsTrigger value="professional" className="font-display text-2xl mr-2">Professional</TabsTrigger>
        <TabsTrigger value="group" className="font-display text-2xl mr-2">Group</TabsTrigger>
        <TabsTrigger value="personal" className="font-display text-2xl mr-2">Personal</TabsTrigger>
      </TabsList>
      <Separator className="h-1 rounded-xl mt-2 mb-4" />
      <TabsContent value="professional">
        <div className="grid grid-cols-1 gap-4 mx-auto lg:mx-0 md:grid-cols-3">
            {professional
              .map((project, index) => (
                <ProjectCard key={index} project={project}>

                </ProjectCard>
            ))}
        </div>
      </TabsContent>
      <TabsContent value="group">
        <div className="grid grid-cols-1 gap-4 mx-auto lg:mx-0 md:grid-cols-3">
          {group
            .map((project, index) => (
              <ProjectCard key={index} project={project}>

              </ProjectCard>
          ))}
        </div>
      </TabsContent>
      <TabsContent value="personal">
        <div className="grid grid-cols-1 gap-4 mx-auto lg:mx-0 md:grid-cols-3">
          {personal
            .map((project, index) => (
              <ProjectCard key={index} project={project}>

              </ProjectCard>
          ))}
        </div>
      </TabsContent>
    </Tabs>
    </div>

  </div>
    
	);
}