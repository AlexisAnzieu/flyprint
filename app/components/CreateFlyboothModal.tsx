"use client";

import React, { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: (id: string) => void;
};

export default function CreateFlyboothModal({
  open,
  onClose,
  onCreated,
}: Props) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  async function handleCreate() {
    if (!name.trim()) {
      setError("Le nom est requis");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/flybooth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message || "Erreur lors de la création");
      }

      const resBody = await res.json();

      onCreated(resBody.id);
    } catch (err: any) {
      setError(err?.message || "Erreur lors de la création");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative bg-slate-900 text-white rounded-lg shadow-lg w-full max-w-md p-6 z-10">
        <h3 className="text-lg font-semibold mb-3">
          Créer un nouveau flybooth
        </h3>
        <label className="block text-sm text-slate-300 mb-2">Nom</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 rounded bg-white/5 border border-white/10 mb-4"
          placeholder="Nom du flybooth"
        />
        {error && <div className="text-sm text-red-400 mb-3">{error}</div>}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-white/6 hover:bg-white/10"
            disabled={loading}
          >
            Annuler
          </button>
          <button
            onClick={handleCreate}
            className={`px-4 py-1 rounded font-medium text-white ${
              loading
                ? "bg-slate-500"
                : "bg-gradient-to-r from-purple-500 to-pink-500"
            }`}
            disabled={loading}
          >
            {loading ? "Création..." : "Créer"}
          </button>
        </div>
      </div>
    </div>
  );
}
