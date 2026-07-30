import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "../components/Navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Le Français",
    template: "%s | Le Français",
  },
  description:
    "Interactive French reading lessons, vocabulary and comprehension practice.",
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
      <body className="flex min-h-screen flex-col bg-slate-50 text-slate-950">
        <Navbar />

        <div className="flex-1">{children}</div>

        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Le Français. All rights reserved.</p>

            <div className="flex gap-5">
              <a href="/about" className="hover:text-blue-700">
                About
              </a>

              <a href="/contact" className="hover:text-blue-700">
                Contact
              </a>

              <a href="/privacy" className="hover:text-blue-700">
                Privacy
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}