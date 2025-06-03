
import { Inter } from "next/font/google";
import LocalFont from "next/font/local";
import { Metadata } from "next";
import "@/global.css";

export const metadata: Metadata = {
  title: {
    default: "shreyasportfolio.co",
    template: "%s | shreyasportfolio.co",
  },
  description:
    "Student at Georgia Tech pursuing my bachelor of science in computer science",
  openGraph: {
    title: "shreyasportfolio",
    description:
      "Student at Georgia Tech pursuing my bachelor of science in computer science",
    url: "www.shreyasportfolio.co",
    siteName: "shreyasportfolio",
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
    shortcut: "/portfolio-icon.png",
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
    <html lang="en" className={`${inter.variable} ${calSans.variable}`}>
      <body className="h-screen">
        {children}
      </body>
    </html>
  );
}
