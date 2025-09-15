"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import CreateFlyboothModal from "./CreateFlyboothModal";

export default function CreateFlyboothButton() {
  const router = useRouter();
  const [creating, setCreating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      {error && <div className="text-sm text-red-400">{error}</div>}
      <button
        onClick={() => setModalOpen(true)}
        disabled={creating}
        className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-md font-medium text-white shadow-sm transform transition-all duration-150 touch-manipulation w-full sm:w-auto ${
          creating
            ? "bg-slate-500 cursor-not-allowed"
            : "bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105"
        }`}
      >
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path
            d="M12 5v14M5 12h14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>{creating ? "Création..." : "Créer un flybooth"}</span>
      </button>

      {modalOpen && (
        <CreateFlyboothModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onCreated={(id) => {
            setModalOpen(false);
            router.push(`/dashboard/${id}`);
          }}
        />
      )}
    </>
  );
}
