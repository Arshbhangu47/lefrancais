import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Le Français",
  description: "Learn French through interactive reading lessons.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen bg-white text-gray-900 flex flex-col">
        <Navbar />

        <main className="flex-1">
          {children}
        </main>

        <footer className="border-t py-8 text-center text-gray-500">
          © 2026 Le Français • All Rights Reserved
        </footer>
      </body>
    </html>
  );
}