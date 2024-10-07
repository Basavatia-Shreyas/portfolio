import "../global.css";
import { Inter } from "next/font/google";
import LocalFont from "next/font/local";
import { Metadata } from "next";


export const metadata: Metadata = {
	title: {
		default: "shreyas.com",
		template: "%s | shreyas.com",
	},
	description: "Student at Georgia Tech pursuing my bachelor of science in computer science",
	openGraph: {
		title: "Shreyas.com",
		description:
			"Student at Georgia Tech pursuing my bachelor of science in computer science",
		url: "https://portfolio-website-pi-mocha.vercel.app",
		siteName: "Shreyas.com",
		images: [
			{
				url: "https://portfolio-website-pi-mocha.vercel.app/og.png",
				width: 1920,
				height: 1080,
			},
		],
		locale: "en-US",
		type: "website",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	icons: {
		shortcut: "/favicon.png",
	},
};
const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
});

const calSans = LocalFont({
	src: "../public/fonts/CalSans-SemiBold.ttf",
	variable: "--font-calsans",
});

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={[inter.variable, calSans.variable].join(" ")}>
			<head>
			</head>
			<body
				className={`bg-zinc-900 font-mono ${
					process.env.NODE_ENV === "development" ? "debug-screens" : null
				}`}
			>
				{children}
			</body>
		</html>
	);
}
