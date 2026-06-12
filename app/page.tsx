import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-5">
      <Link
        href="/notices"
        className="rounded-md bg-cyan-500 px-5 py-3 text-sm font-black text-white"
      >
        NEWS
      </Link>
    </main>
  );
}
