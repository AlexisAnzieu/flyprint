"use client";

import React, { useEffect, useState } from "react";

export default function PrinterStatus() {
  // Printer connection state: null = unknown, true = connected, false = not connected
  const [printerConnected, setPrinterConnected] = useState<boolean | null>(
    null
  );
  const [printerCheckLoading, setPrinterCheckLoading] =
    useState<boolean>(false);

  async function checkPrinterConnection() {
    setPrinterCheckLoading(true);
    setPrinterConnected(null);
    try {
      const res = await fetch("/api/printer-status");
      const data = await res.json();
      setPrinterConnected(!!data.connected);
    } catch {
      setPrinterConnected(false);
    } finally {
      setPrinterCheckLoading(false);
    }
  }

  useEffect(() => {
    // Check printer connection on mount
    checkPrinterConnection();
  }, []);

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border text-white transition-all duration-300
      ${
        printerCheckLoading
          ? "border-gray-400 bg-gray-900/60"
          : printerConnected === true
          ? "border-green-400 bg-green-900/20"
          : printerConnected === false
          ? "border-red-400 bg-red-900/20"
          : "border-gray-400 bg-gray-900/60"
      }
    `}
    >
      <div className="flex items-center gap-4">
        <PrinterStatusIcon
          connected={printerConnected}
          loading={printerCheckLoading}
        />
        <div className="flex-1">
          <div
            className={`text-sm font-semibold ${
              printerCheckLoading
                ? "text-gray-300"
                : printerConnected === true
                ? "text-green-400"
                : printerConnected === false
                ? "text-red-400"
                : "text-gray-300"
            }`}
          >
            {printerCheckLoading
              ? "Vérification de l'imprimante..."
              : printerConnected === true
              ? "Imprimante connectée"
              : printerConnected === false
              ? "Imprimante non connectée"
              : "Statut inconnu"}
          </div>
          <div className="text-slate-400 text-xs mt-1">
            {printerConnected === true &&
              !printerCheckLoading &&
              "L'imprimante est prête à recevoir des impressions."}
            {printerConnected === false &&
              !printerCheckLoading &&
              "Veuillez vérifier la connexion de l'imprimante."}
            {printerCheckLoading && "Connexion en cours..."}
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        {printerConnected === false && !printerCheckLoading && (
          <a
            href="/flybooth_manual_v1.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-3 rounded font-medium text-white text-sm text-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-colors duration-200 touch-manipulation"
          >
            Installez l&apos;imprimante
          </a>
        )}
        <button
          onClick={checkPrinterConnection}
          disabled={printerCheckLoading}
          className={`px-4 py-3 rounded font-medium text-white text-sm transition-all duration-300 touch-manipulation ${
            printerCheckLoading
              ? "bg-slate-500 cursor-not-allowed"
              : "bg-gradient-to-r from-green-500 to-emerald-500"
          }`}
        >
          {printerCheckLoading ? "Vérification..." : "Vérifier"}
        </button>
      </div>
    </div>
  );
}

// Printer status icons
const PrinterStatusIcon = ({
  connected,
  loading,
}: {
  connected: boolean | null;
  loading: boolean;
}) => {
  if (loading) {
    return (
      <span
        className="w-8 h-8 border-4 border-gray-300 border-t-green-400 rounded-full animate-spin"
        title="Vérification en cours"
      ></span>
    );
  }
  if (connected === null) {
    return (
      <span
        className="w-8 h-8 border-4 border-gray-300 border-t-gray-400 rounded-full animate-spin"
        title="Statut inconnu"
      ></span>
    );
  }
  if (connected) {
    return (
      <span
        className="w-8 h-8 flex items-center justify-center bg-green-500/20 border-4 border-green-400 rounded-full text-green-600 text-2xl shadow-lg"
        title="Imprimante connectée"
      >
        ✔️
      </span>
    );
  }
  return (
    <span
      className="w-8 h-8 flex items-center justify-center bg-red-500/20 border-4 border-red-400 rounded-full text-red-600 text-2xl shadow-lg"
      title="Imprimante non connectée"
    >
      ❌
    </span>
  );
};
