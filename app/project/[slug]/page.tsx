import Markdown from "markdown-to-jsx";
import getPostMetaData from "@/utils/getPostMetadata";
import React from "react";
import fs from "fs";
import matter from "gray-matter";
import Link from "next/link";
import { Github, ArrowLeft } from "lucide-react";
import { render } from 'react-dom'

// Define the type for the slug parameter
interface Params {
  slug: string;
}

// Define the return type for the content matter result
interface MatterResult {
  content: string;
  data: {
    title: string;
    description?: string;
    date?: string;
    published?: boolean;
    url?: string;
    tags: string;
    [key: string]: any; // Allow for additional metadata properties
  };
}

// Function to get project content based on the slug
function getProjectContent(slug: string): matter.GrayMatterFile<string> {
  const folder = "projects/";
  const file = `${folder}${slug}.mdx`;
  const content = fs.readFileSync(file, "utf-8");

  const matterResult = matter(content);
  return matterResult;
}

// Generate static params for dynamic routing
export const generateStaticParams = async (): Promise<Array<{ slug: string }>> => {
  const posts = getPostMetaData("projects");
  return posts.map((post) => ({ slug: post.slug }));
};

// Generate metadata for the page
export async function generateMetadata({ params }: { params: Params }): Promise<{ title: string }> {
  const id = params?.slug ? ` . ${params?.slug}` : "";
  return {
    title: `Portfolio Website ${id.replaceAll("_", " ")}`,
  };
}

// Define props for the ProjectPage component
interface ProjectPageProps {
  params: Params;
}

// ProjectPage component
const ProjectPage: React.FC<ProjectPageProps> = ({ params }) => {
  const { content, data } = getProjectContent(params.slug);

  const slug = params.slug;
  const post = getProjectContent(slug)
  //console.log(post)

  return (
    
    <div className="bg-white w-full h-full">
        <header
			className="relative isolate overflow-hidden bg-zinc-900"
		>
			<div
				className="fixed inset-x-0 top-0 z-50 backdrop-blur lg:backdrop-blur-none duration-200 border-b lg:bg-transparent  border-zinc-200 lg:border-transparent"
			>
				<div className="container flex flex-row-reverse items-center justify-between p-6 mx-auto">
					<div className="flex justify-between gap-8">
						<span
							title="View counter for this page"
							className="duration-200 hover:font-medium flex items-center gap-1 text-zinc-600 hover:text-zinc-900">
						</span>
						<Link target="_blank" href="https://github.com/Basavatia-Shreyas">
							<Github
								className="w-6 h-6 duration-200 hover:font-medium text-zinc-600 hover:text-zinc-900"/>
						</Link>
					</div>

					<Link
						href="/"
						className="duration-200 hover:font-medium text-zinc-300 hover:text-zinc-600"
					>
						<ArrowLeft className="w-6 h-6 " />
					</Link>
				</div>
			</div>
			<div className="container mx-auto relative isolate overflow-hidden  py-24 sm:py-32">
				<div className="mx-auto max-w-7xl px-6 lg:px-8 text-center flex flex-col items-center">
					<div className="mx-auto max-w-2xl lg:mx-0">
						<h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl font-display">
							{data.title}
						</h1>
						<p className="mt-6 text-lg leading-8 text-zinc-300">
							{data.description}
						</p>
                        {data.url ? (
                            <a href={data.url} className="mt-10 text-lg leading-8 text-zinc-300 border border-zinc-500 rounded px-2 py-1">
							    Website
						    </a>
                        ) : (
                            <a>

                            </a>
                        )}
                        
					</div>

					<div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
						<div className="grid grid-cols-1 gap-y-6 gap-x-8 text-base font-semibold leading-7 text-white sm:grid-cols-2 md:flex lg:gap-x-10">
						</div>
					</div>
				</div>
			</div>
		</header>
        <div className="max-w-6xl mx-auto mb-20">
            <article className="py-10">
                <Markdown className="markdown">
                    {content}
                </Markdown>
            </article>
        </div>
    </div>
  );
};

export default ProjectPage;