import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        <Link
          href="/"
          className="text-2xl font-bold text-blue-600"
        >
          Le Français
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-gray-700">

          <Link href="/">Home</Link>

          <Link href="/lessons">Lessons</Link>

          <Link href="/about">About</Link>

          <Link href="/contact">Contact</Link>

        </nav>

        <div className="flex gap-3">

          <button className="rounded-lg border px-4 py-2 hover:bg-gray-100">
            Login
          </button>

          <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            Get Started
          </button>

        </div>
      </div>
    </header>
  );
}