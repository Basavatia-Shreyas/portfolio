"use client";
import {
	motion,
	useMotionTemplate,
	useMotionValue,
	useSpring,
} from "framer-motion";
import Link from "next/link";
import { Badge } from "@/components/ui/badge"


import { MouseEventHandler, PropsWithChildren } from "react";

interface Project {
	title: string;
    description: string;
    date: string;
    published: boolean;
    url: string;
	slug: string;
	type: string;
	tags: string;
}

interface ProjectCardProps {
	project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
	console.log(project.tags);
	const items = project.tags.split(',');
	return (
		<Link href={`/project/${project.slug}`}>
			<div className="overflow-hidden relative duration-700 border-2 rounded-xl hover:bg-zinc-800/10 group md:gap-8 hover:border-zinc-200/50 border-zinc-300 py-8 px-5">
				<h1 className="font-display text-3xl mb-3">
					{project.title}
				</h1>
				<div className="my-2">
					{items.map((item, index) => (
						<Badge variant="secondary" className="mx-1">{item}</Badge>
					))}
				</div>
				<p className="text-zinc-400 text-sm">
					{project.description}
				</p>
			</div>
		</Link>
	)
}
// export const ProjectCard: React.FC<PropsWithChildren> = ({ children }) => {
// 	const mouseX = useSpring(0, { stiffness: 500, damping: 100 });
// 	const mouseY = useSpring(0, { stiffness: 500, damping: 100 });

// 	function onMouseMove({ currentTarget, clientX, clientY }: any) {
// 		const { left, top } = currentTarget.getBoundingClientRect();
// 		mouseX.set(clientX - left);
// 		mouseY.set(clientY - top);
// 	}
// 	const maskImage = useMotionTemplate`radial-gradient(240px at ${mouseX}px ${mouseY}px, white, transparent)`;
// 	const style = { maskImage, WebkitMaskImage: maskImage };

// 	return (
// 		<div
// 			onMouseMove={onMouseMove}
// 			className="overflow-hidden relative duration-700 border-2 rounded-xl hover:bg-zinc-800/10 group md:gap-8 hover:border-zinc-200/50 border-zinc-300 "
// 		>
// 			<div className="pointer-events-none">
// 				<div className="absolute inset-0 z-0  transition duration-1000 [mask-image:linear-gradient(black,transparent)]" />
// 				<motion.div
// 					className="absolute inset-0 z-10  bg-gradient-to-br opacity-100  via-zinc-100/10  transition duration-1000 group-hover:opacity-50 "
// 					style={style}
// 				/>
// 				<motion.div
// 					className="absolute inset-0 z-10 opacity-0 mix-blend-overlay transition duration-1000 group-hover:opacity-100"
// 					style={style}
// 				/>
// 			</div>

// 			{children}
// 		</div>
// 	);
// };
