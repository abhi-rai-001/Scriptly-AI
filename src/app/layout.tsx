import type { Metadata } from "next";
import { Space_Grotesk, Syne, Geist_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Scriptly AI — AI Script & Thumbnail Generator for Creators",
    template: "%s | Scriptly AI",
  },
  description:
    "Generate viral short-form video scripts, hooks, scene breakdowns, captions, hashtags, and AI thumbnails in minutes. Built for Instagram Reels, YouTube Shorts, and TikTok creators.",
  keywords: [
    "AI script generator",
    "reel script",
    "TikTok script",
    "YouTube Shorts script",
    "AI thumbnail generator",
    "content creator tools",
    "viral hooks",
  ],
  authors: [{ name: "Scriptly AI" }],
  creator: "Scriptly AI",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    siteName: "Scriptly AI",
    title: "Scriptly AI — AI Script & Thumbnail Generator for Creators",
    description:
      "Generate viral video scripts and AI thumbnails in minutes. Stop scripting. Start creating.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Scriptly AI — AI Script & Thumbnail Generator for Creators",
    description:
      "Generate viral video scripts and AI thumbnails in minutes. Stop scripting. Start creating.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${syne.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
