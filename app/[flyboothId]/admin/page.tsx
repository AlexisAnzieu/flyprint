"use client";

import React, { useEffect, useRef, useState } from "react";
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
        className="w-10 h-10 border-4 border-gray-300 border-t-green-400 rounded-full animate-spin"
        title="Vérification en cours"
      ></span>
    );
  }
  if (connected === null) {
    return (
      <span
        className="w-10 h-10 border-4 border-gray-300 border-t-gray-400 rounded-full animate-spin"
        title="Statut inconnu"
      ></span>
    );
  }
  if (connected) {
    return (
      <span
        className="w-10 h-10 flex items-center justify-center bg-green-500/20 border-4 border-green-400 rounded-full text-green-600 text-3xl shadow-lg"
        title="Imprimante connectée"
      >
        ✔️
      </span>
    );
  }
  return (
    <span
      className="w-10 h-10 flex items-center justify-center bg-red-500/20 border-4 border-red-400 rounded-full text-red-600 text-3xl shadow-lg"
      title="Imprimante non connectée"
    >
      ❌
    </span>
  );
};
import Image from "next/image";

export default function Home({ params: { flyboothId } }: any) {
  // Printer connection state: null = unknown, true = connected, false = not connected
  const [printerConnected, setPrinterConnected] = useState<boolean | null>(
    null
  );
  const [printerCheckLoading, setPrinterCheckLoading] =
    useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>(
    `https://res.cloudinary.com/dkbuiehgq/image/upload/v1730161876/flybooth/${flyboothId}/admin/logo`
  );
  const [text, setText] = useState<string>("");
  const [textError, setTextError] = useState<string | null>(null);
  const [textLoading, setTextLoading] = useState<boolean>(false);
  const [hasTime, setHasTime] = useState<boolean>(false);
  const [printError, setPrintError] = useState<string | null>(null);

  // Move checkPrinterConnection to component scope
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
    async function fetchFlybooth() {
      try {
        const response = await fetch(`/api/flybooth?id=${flyboothId}`);
        if (!response.ok) {
          throw new Error("Erreur survenue lors de la récupération du texte");
        }
        const data = await response.json();
        if (data) {
          setText(data.texts.map((text: any) => text.content).join("\n"));
          setHasTime(data.hasTime);
        }
      } catch (error) {
        setTextError("Erreur survenue lors de la récupération du texte");
      }
    }

    fetchFlybooth();
  }, [flyboothId]);

  async function uploadFile(e: React.ChangeEvent<HTMLInputElement>) {
    setIsLoading(true);
    setError(null);
    const file = e.target.files?.[0];
    if (!file) {
      setIsLoading(false);
      return;
    }

    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("sessionId", flyboothId);

      const res = await fetch("/api/upload-logo", {
        method: "POST",
        body: fd,
      });
      const response: any = await res.json();
      if (res.ok && response.secure_url) {
        setUploadedImageUrl(response.secure_url);
      } else {
        setError(
          response.error || "Erreur survenue lors de l'envoi de la photo"
        );
      }
    } catch (error) {
      setError("Erreur survenue lors de l'envoi de la photo");
    } finally {
      setIsLoading(false);
    }
  }

  async function sendText() {
    setTextLoading(true);
    setTextError(null);

    try {
      const response = await fetch("/api/flybooth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: flyboothId,
          texts: text.split("\n"),
          hasTime,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur survenue lors de l'envoi du texte");
      }
    } catch (error: any) {
      setTextError(error.message);
    } finally {
      setTextLoading(false);
    }
  }

  async function printQRCode() {
    setPrintError(null);
    try {
      const response = await fetch("/api/print", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: `https://print.flybooth.app/${flyboothId}/`,
        }),
      });

      if (!response.ok) {
        let errorMsg = "Erreur survenue lors de l'impression du QR code";
        if (response.status === 530) {
          errorMsg =
            "Erreur : l'imprimante n'est pas disponible. Veuillez vérifier la connexion de l'imprimante.";
        } else {
          try {
            const data = await response.json();
            if (
              data &&
              data.error &&
              data.error.toLowerCase().includes("printer error")
            ) {
              errorMsg =
                "Erreur : l'imprimante n'est pas disponible. Veuillez vérifier la connexion de l'imprimante.";
            }
          } catch {}
        }
        setPrintError(errorMsg);
        throw new Error(errorMsg);
      }
    } catch (error: any) {
      setPrintError(
        error.message || "Erreur survenue lors de l'impression du QR code"
      );
      console.error("Printing error:", error.message);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex justify-center items-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            FlyBooth Admin
          </h1>
          <p className="text-slate-300 text-lg">
            Gérez votre configuration d&apos;impression
          </p>
        </div>

        {/* Printer status at top - enhanced design */}
        <div className="mb-6">
          <div
            className={`flex flex-col md:flex-row items-center justify-between gap-4 p-6 rounded-2xl shadow-xl border-2 transition-all duration-300 
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
            <div className="flex items-center gap-5">
              <PrinterStatusIcon
                connected={printerConnected}
                loading={printerCheckLoading}
              />
              <div>
                <div
                  className={`text-xl font-bold ${
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
                <div className="text-slate-400 text-sm mt-1">
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
            <button
              onClick={checkPrinterConnection}
              disabled={printerCheckLoading}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white text-base transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400/50
                ${
                  printerCheckLoading
                    ? "bg-slate-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 hover:scale-105 active:scale-95"
                }
              `}
              aria-label="Vérifier la connexion de l'imprimante"
            >
              <span className="text-lg">🔄</span>
              {printerCheckLoading ? "Vérification..." : "Vérifier"}
            </button>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-1">
          {/* Logo Upload Section */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-sm">
                🖼️
              </span>
              Configuration du Logo
            </h2>

            <input
              aria-label="File browser example"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={uploadFile}
              ref={fileInputRef}
            />

            <div
              onClick={() => !isLoading && fileInputRef.current?.click()}
              className={`group relative overflow-hidden rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer ${
                isLoading
                  ? "border-slate-400 bg-slate-500/20"
                  : "border-purple-400 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 hover:border-purple-300"
              } p-8`}
            >
              <div className="text-center">
                {isLoading ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="text-white font-medium">
                      Envoi en cours...
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xl">
                      📷
                    </div>
                    <span className="text-white font-medium text-lg">
                      Modifier le logo
                    </span>
                    <p className="text-slate-300 text-sm">
                      Cliquez pour sélectionner une image
                    </p>
                  </div>
                )}
              </div>
            </div>

            {uploadedImageUrl && (
              <div className="mt-6">
                <div className="relative group">
                  <Image
                    src={uploadedImageUrl}
                    alt="Logo téléchargé"
                    width={300}
                    height={200}
                    className="w-full max-w-xs mx-auto h-auto rounded-xl shadow-lg border border-white/20 transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
                    <span className="text-white font-medium">Logo actuel</span>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-500/20 border border-red-400/50 rounded-lg">
                <div className="flex items-center gap-2 text-red-300">
                  <span className="text-lg">⚠️</span>
                  <span className="font-medium">{error}</span>
                </div>
              </div>
            )}
          </div>

          {/* Text Configuration Section */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-sm">
                📝
              </span>
              Configuration du Texte
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-slate-300 font-medium mb-3">
                  Texte d&apos;impression
                </label>
                <textarea
                  className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                  rows={5}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Entrez votre texte d'impression ici..."
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    type="checkbox"
                    id="addTime"
                    checked={hasTime}
                    onChange={(e) => setHasTime(e.target.checked)}
                    className="sr-only"
                  />
                  <label
                    htmlFor="addTime"
                    className={`flex items-center gap-3 cursor-pointer select-none p-3 rounded-lg transition-all duration-300 ${
                      hasTime
                        ? "bg-purple-500/20 border border-purple-400/50"
                        : "bg-white/5 border border-white/20 hover:bg-white/10"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-300 ${
                        hasTime
                          ? "bg-purple-500 border-purple-500"
                          : "border-slate-400"
                      }`}
                    >
                      {hasTime && <span className="text-white text-xs">✓</span>}
                    </div>
                    <span className="text-white font-medium">
                      Ajouter l&apos;heure d&apos;impression
                    </span>
                  </label>
                </div>
              </div>

              <button
                onClick={sendText}
                disabled={textLoading}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 shadow-lg ${
                  textLoading
                    ? "bg-slate-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:shadow-xl hover:scale-105 active:scale-95"
                }`}
              >
                {textLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Envoi en cours...
                  </div>
                ) : (
                  "Mettre à jour la configuration"
                )}
              </button>

              {textError && (
                <div className="p-4 bg-red-500/20 border border-red-400/50 rounded-lg">
                  <div className="flex items-center gap-2 text-red-300">
                    <span className="text-lg">⚠️</span>
                    <span className="font-medium">{textError}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* QR Code Print Section */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-sm">
                📄
              </span>
              Impression QR Code pour le public
            </h2>

            <button
              onClick={printQRCode}
              className="w-full py-4 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg">🖨️</span>
                Imprimer le QR code
              </div>
            </button>

            {printError && (
              <div className="mt-4 p-4 bg-red-500/20 border border-red-400/50 rounded-lg">
                <div className="flex items-center gap-2 text-red-300">
                  <span className="text-lg">⚠️</span>
                  <span className="font-medium">{printError}</span>
                </div>
              </div>
            )}

            <p className="text-slate-300 text-sm mt-3 text-center">
              Imprime un QR code pour accéder à la page publique
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
