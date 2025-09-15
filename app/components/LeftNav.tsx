"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function LeftNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Hamburger Menu Button - Only visible on mobile when menu is closed */}
      {!isMobileMenuOpen && (
        <button
          onClick={toggleMobileMenu}
          className="fixed top-4 left-4 z-50 p-2 bg-slate-900/90 text-white rounded-lg shadow-lg md:hidden hover:bg-slate-800/90 transition-colors"
          aria-label="Open navigation menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      )}

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Navigation Sidebar */}
      <aside
        className={`
        w-64 bg-slate-900/90 text-white min-h-screen p-4
        md:block md:relative md:translate-x-0
        fixed top-0 left-0 z-40 transition-transform duration-300 ease-in-out
        ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }
      `}
      >
        <div className="mb-8">
          <Link href="/" className="text-2xl font-bold block mb-2">
            Flyprint
          </Link>
          <div className="text-sm text-slate-300">Photobooth admin</div>
        </div>

        <nav className="flex flex-col gap-2">
          <Link
            href="/dashboard"
            className="px-3 py-2 rounded hover:bg-white/5"
            onClick={closeMobileMenu}
          >
            Tableau de bord
          </Link>
          <Link
            href="/dashboard/statistics"
            className="px-3 py-2 rounded hover:bg-white/5"
            onClick={closeMobileMenu}
          >
            Statistiques
          </Link>
          <a
            href="/flybooth_manual_v1.pdf"
            className="px-3 py-2 rounded bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-md hover:from-blue-700 hover:to-purple-700 transition-colors duration-200 cursor-pointer flex items-center gap-2"
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMobileMenu}
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
    </>
  );
}
