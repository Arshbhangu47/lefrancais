"use client";

import Link from "next/link";
import { useState } from "react";

const navigationLinks = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/courses",
    label: "Courses",
  },
  {
    href: "/lessons",
    label: "Lessons",
  },
  {
    href: "/about",
    label: "About",
  },
  {
    href: "/contact",
    label: "Contact",
  },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function closeMenu() {
    setMobileMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6">
        <Link
          href="/"
          onClick={closeMenu}
          className="text-2xl font-extrabold tracking-tight text-blue-700"
        >
          Le Français
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navigationLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-medium text-slate-700 transition hover:text-blue-700"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="rounded-xl border border-slate-300 px-5 py-2.5 font-semibold text-slate-800 transition hover:border-blue-600 hover:text-blue-700"
          >
            Login
          </Link>

          <Link
            href="/lessons"
            className="rounded-xl bg-blue-700 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-800"
          >
            Start Learning
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((current) => !current)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-300 bg-white text-2xl text-slate-900 md:hidden"
        >
          {mobileMenuOpen ? "×" : "☰"}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-5 py-5 md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-2">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="rounded-xl px-4 py-3 font-semibold text-slate-800 transition hover:bg-blue-50 hover:text-blue-700"
              >
                {link.label}
              </Link>
            ))}

            <div className="mt-3 grid grid-cols-2 gap-3 border-t border-slate-200 pt-5">
              <Link
                href="/login"
                onClick={closeMenu}
                className="rounded-xl border border-slate-300 px-4 py-3 text-center font-semibold text-slate-800"
              >
                Login
              </Link>

              <Link
                href="/lessons"
                onClick={closeMenu}
                className="rounded-xl bg-blue-700 px-4 py-3 text-center font-semibold text-white"
              >
                Start Learning
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}