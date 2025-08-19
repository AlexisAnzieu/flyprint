"use client";

import React from "react";
import Link from "next/link";

export default function LeftNav() {
  return (
    <aside className="w-64 bg-slate-900/90 text-white min-h-screen p-4 block">
      <div className="mb-8">
        <Link href="/" className="text-2xl font-bold block mb-2">
          Flyprint
        </Link>
        <div className="text-sm text-slate-300">Photobooth admin</div>
      </div>

      <nav className="flex flex-col gap-2">
        <Link href="/dashboard" className="px-3 py-2 rounded hover:bg-white/5">
          Tableau de bord
        </Link>
      </nav>
    </aside>
  );
}
