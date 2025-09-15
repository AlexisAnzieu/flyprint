"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ThermalPaperPreview from "@/app/components/ThermalPaperPreview";
import { Flybooth } from "@prisma/client";

type Props = {
  flybooth: Flybooth;
};

export default function FlyboothAdminPanel({ flybooth }: Props) {
  // Printer connection state: null = unknown, true = connected, false = not connected
  const [printerConnected, setPrinterConnected] = useState<boolean | null>(
    null
  );
  const [printerCheckLoading, setPrinterCheckLoading] =
    useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(
    // derive the uploaded image url directly from flybooth id (same logic as server)
    flybooth
      ? `https://res.cloudinary.com/dkbuiehgq/image/upload/v1730161876/flybooth/${flybooth.id}/admin/logo`
      : null
  );
  const [text, setText] = useState<string[]>(flybooth?.texts ?? []);
  const [textError, setTextError] = useState<string | null>(null);
  const [textLoading, setTextLoading] = useState<boolean>(false);
  const [hasTime, setHasTime] = useState<boolean>(Boolean(flybooth?.hasTime));
  const [printError, setPrintError] = useState<string | null>(null);
  const [logoWidth, setLogoWidth] = useState<number>(
    typeof flybooth?.logoWidth === "number" ? flybooth.logoWidth : 200
  );
  const [logoHeight, setLogoHeight] = useState<number>(
    typeof flybooth?.logoHeight === "number" ? flybooth.logoHeight : 200
  );

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
      fd.append("sessionId", flybooth.id);

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
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: flybooth.id,
          texts: text,
          hasTime,
          logoWidth,
          logoHeight,
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
          text: `https://print.flybooth.app/${flybooth.id}/`,
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
    <div className="space-y-4">
      <div className="flex items-center  pt-12 md:pt-0">
        <Link
          href="/dashboard"
          className="px-3 py-2 rounded bg-white/6 text-white hover:bg-white/10 touch-manipulation"
        >
          ←
        </Link>
        <div className="text-white font-semibold truncate">{flybooth.name}</div>
      </div>

      <div className="w-full  bg-slate-900/80 p-4 sm:p-6 rounded-2xl shadow-xl text-white">
        {/* Printer status */}
        <div className="mb-6">
          <div
            className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border transition-all duration-300
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
            <button
              onClick={checkPrinterConnection}
              disabled={printerCheckLoading}
              className={`px-4 py-3 rounded font-medium text-white text-sm transition-all duration-300 touch-manipulation w-full sm:w-auto ${
                printerCheckLoading
                  ? "bg-slate-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-500 to-emerald-500"
              }`}
            >
              {printerCheckLoading ? "Vérification..." : "Vérifier"}
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="bg-white/8 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">
                Configuration de l&apos;impression
              </h4>

              <input
                aria-label="File browser example"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={uploadFile}
                ref={fileInputRef}
              />
              <button
                type="button"
                onClick={() => !isLoading && fileInputRef.current?.click()}
                disabled={isLoading}
                className={`w-full sm:w-auto px-4 py-3 rounded-md font-medium text-white touch-manipulation ${
                  isLoading
                    ? "bg-slate-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-500 to-pink-500"
                }`}
              >
                {isLoading ? "Envoi..." : "Modifier le logo"}
              </button>

              <div className="mt-4 space-y-4">
                <label className="block text-slate-300 font-medium mb-2">
                  Texte d&apos;impression
                </label>
                <textarea
                  className="w-full p-3 rounded-lg bg-white/5 text-white placeholder-slate-400"
                  rows={5}
                  value={text.join("\n")}
                  onChange={(e) => setText(e.target.value.split("\n"))}
                  placeholder="Entrez votre texte d'impression ici..."
                />
                <div className="flex items-center gap-3">
                  <label
                    className={`flex items-center gap-2 cursor-pointer p-2 rounded ${
                      hasTime ? "bg-purple-500/20" : "bg-white/5"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={hasTime}
                      onChange={(e) => setHasTime(e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      className={`w-4 h-4 rounded border ${
                        hasTime
                          ? "bg-purple-500 border-purple-500"
                          : "border-slate-400"
                      }`}
                    >
                      {hasTime && <span className="text-white text-xs">✓</span>}
                    </div>
                    <span className="text-sm text-white">
                      Ajouter l&apos;heure d&apos;impression
                    </span>
                  </label>
                </div>

                <div>
                  <h5 className="text-sm text-slate-300 mb-2">
                    Dimensions du logo
                  </h5>
                  <div className="space-y-4 sm:grid sm:grid-cols-2 sm:gap-3 sm:space-y-0">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">
                        Largeur
                      </label>
                      <input
                        type="range"
                        min={104}
                        max={2000}
                        step={8}
                        value={logoWidth}
                        onChange={(e) =>
                          setLogoWidth(
                            Math.round(parseInt(e.target.value) / 8) * 8
                          )
                        }
                        className="w-full"
                      />
                      <div className="text-xs text-white mt-1">
                        {logoWidth}px
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">
                        Hauteur
                      </label>
                      <input
                        type="range"
                        min={8}
                        max={300}
                        step={8}
                        value={logoHeight}
                        onChange={(e) =>
                          setLogoHeight(
                            Math.round(parseInt(e.target.value) / 8) * 8
                          )
                        }
                        className="w-full"
                      />
                      <div className="text-xs text-white mt-1">
                        {logoHeight}px
                      </div>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-2 bg-red-500/20 rounded text-red-300">
                    {error}
                  </div>
                )}
                {textError && (
                  <div className="p-2 bg-red-500/20 rounded text-red-300">
                    {textError}
                  </div>
                )}

                <button
                  onClick={sendText}
                  disabled={textLoading}
                  className={`w-full mt-2 py-3 rounded font-semibold touch-manipulation ${
                    textLoading
                      ? "bg-slate-500"
                      : "bg-gradient-to-r from-purple-500 to-pink-500"
                  }`}
                >
                  {textLoading
                    ? "Envoi en cours..."
                    : "Mettre à jour la configuration"}
                </button>
              </div>
            </div>

            <div className="bg-white/8 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">
                Impression QR Code pour le public
              </h4>
              <button
                onClick={printQRCode}
                className="w-full py-3 rounded bg-gradient-to-r from-green-500 to-emerald-500 text-white touch-manipulation"
              >
                🖨️ Imprimer le QR code
              </button>
              {printError && (
                <div className="mt-3 p-2 bg-red-500/20 rounded text-red-300">
                  {printError}
                </div>
              )}
              <p className="text-xs text-slate-300 mt-2 text-center">
                Imprime un QR code pour accéder à la page publique
              </p>
            </div>
          </div>

          <div className="bg-white/8 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">Aperçu</h4>
            <ThermalPaperPreview
              uploadedImageUrl={uploadedImageUrl ?? null}
              logoWidth={logoWidth}
              logoHeight={logoHeight}
              text={text.join("\n")}
              hasTime={hasTime}
            />
          </div>
        </div>
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
import { unstable_noStore as noStore } from "next/cache";
