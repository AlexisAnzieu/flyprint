"use client";

import { useState } from "react";
import { WIFI_PASSWORD, WIFI_SSID } from "@/lib/constants";

export default function Wifi() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(WIFI_PASSWORD);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 text-white">
      <div className="max-w-md mx-auto bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Wi-Fi</h1>

        <section className="mb-4">
          <h2 className="text-sm text-gray-400 mb-1">Réseau</h2>
          <p className="text-xl font-mono">{WIFI_SSID}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-sm text-gray-400 mb-1">Mot de passe</h2>
          <p className="text-xl font-mono">{WIFI_PASSWORD}</p>
        </section>

        <button
          onClick={handleCopy}
          className="w-full py-3 mb-3 rounded bg-blue-600 hover:bg-blue-700 font-semibold"
        >
          {copied ? "Copié !" : "Copier le mot de passe"}
        </button>

        <a
          href="/wifi/wifi.mobileconfig"
          className="block w-full py-3 rounded border border-gray-500 hover:bg-gray-700 text-center font-semibold"
        >
          Installer sur iPhone
        </a>
        <p className="text-xs text-gray-400 mt-2 text-center">
          Autoriser le téléchargement, puis Réglages → Profil téléchargé →
          Installer.
        </p>
      </div>
    </div>
  );
}
