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
        <a
          href="/flybooth_manual_v1.pdf"
          className="px-3 py-2 rounded bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-md hover:from-blue-700 hover:to-purple-700 transition-colors duration-200 cursor-pointer flex items-center gap-2"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <rect
              x="6"
              y="9"
              width="12"
              height="7"
              rx="2"
              stroke="currentColor"
              strokeWidth={2}
              fill="none"
            />
            <path
              d="M6 9V5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v4"
              stroke="currentColor"
              strokeWidth={2}
              fill="none"
            />
            <rect
              x="9"
              y="16"
              width="6"
              height="4"
              rx="1"
              stroke="currentColor"
              strokeWidth={2}
              fill="none"
            />
            <circle cx="17" cy="13" r="1" fill="currentColor" />
          </svg>
          Installez l&apos;imprimante
        </a>
      </nav>
    </aside>
  );
}
