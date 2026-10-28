"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ThermalPaperPreview from "@/app/components/ThermalPaperPreview";
import { Flybooth } from "@prisma/client";

type Props = {
  flybooth: Flybooth;
};

export default function FlyboothAdminPanel({ flybooth }: Props) {
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
  const [logoMissing, setLogoMissing] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);

  useEffect(() => {
    setSaved(false);
  }, [text, hasTime, logoWidth, logoHeight]);

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
        setLogoMissing(false);
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
      setSaved(true);
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
    <div className="max-w-6xl mx-auto space-y-4 pt-12 md:pt-0">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          aria-label="Retour au tableau de bord"
          className="px-3 py-2 rounded-lg bg-white text-gray-700 shadow-sm hover:bg-gray-100 touch-manipulation"
        >
          ←
        </Link>
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-white truncate">
            {flybooth.name}
          </h1>
          <p className="text-sm text-white/70">
            Personnalisez le ticket imprimé pour vos invités.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl text-gray-900 p-4 sm:p-6">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div className="space-y-8">
            <Step
              number={1}
              title="Logo en haut du ticket"
              description="Le logo est enregistré dès que vous le choisissez."
            >
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 flex-shrink-0 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
                  {uploadedImageUrl && !logoMissing ? (
                    <Image
                      src={uploadedImageUrl}
                      alt="Logo actuel"
                      width={80}
                      height={80}
                      className="object-contain w-full h-full"
                      onError={() => setLogoMissing(true)}
                    />
                  ) : (
                    <span className="text-xs text-gray-400 text-center px-1">
                      Aucun logo
                    </span>
                  )}
                </div>
                <input
                  aria-label="Choisir un logo"
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
                  className={`px-4 py-3 rounded-lg font-medium text-white touch-manipulation ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  }`}
                >
                  {isLoading ? "Envoi..." : "Changer le logo"}
                </button>
              </div>
              {error && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="mt-5">
                <h4 className="text-sm font-medium text-gray-700">
                  Taille du logo sur le ticket
                </h4>
                <p className="text-xs text-gray-500 mb-3">
                  Regardez l&apos;aperçu pour ajuster.
                </p>
                <div className="space-y-4 sm:grid sm:grid-cols-2 sm:gap-6 sm:space-y-0">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <label htmlFor="logo-width" className="text-gray-600">
                        Largeur
                      </label>
                      <span className="font-mono text-gray-900">
                        {logoWidth}px
                      </span>
                    </div>
                    <input
                      id="logo-width"
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
                      className="w-full accent-purple-600"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <label htmlFor="logo-height" className="text-gray-600">
                        Hauteur
                      </label>
                      <span className="font-mono text-gray-900">
                        {logoHeight}px
                      </span>
                    </div>
                    <input
                      id="logo-height"
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
                      className="w-full accent-purple-600"
                    />
                  </div>
                </div>
              </div>
            </Step>

            <Step
              number={2}
              title="Texte sous la photo"
              description="Chaque ligne est imprimée, centrée, sous la photo de l'invité."
            >
              <textarea
                className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                rows={4}
                value={text.join("\n")}
                onChange={(e) => setText(e.target.value.split("\n"))}
                placeholder={"Ex. : Mariage de Julie & Marc\nMerci d'être là !"}
              />
              <label className="mt-3 flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={hasTime}
                  onChange={(e) => setHasTime(e.target.checked)}
                  className="sr-only peer"
                />
                <span className="relative w-10 h-6 flex-shrink-0 rounded-full bg-gray-300 transition-colors peer-checked:bg-purple-600 peer-focus-visible:ring-2 peer-focus-visible:ring-purple-500 after:absolute after:top-1 after:left-1 after:w-4 after:h-4 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-4" />
                <span className="text-sm text-gray-700">
                  Imprimer la date et l&apos;heure sous le texte
                </span>
              </label>
            </Step>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              {textError && (
                <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  {textError}
                </div>
              )}
              <button
                onClick={sendText}
                disabled={textLoading}
                className={`w-full py-3 rounded-lg font-semibold text-white touch-manipulation ${
                  textLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                }`}
              >
                {textLoading
                  ? "Enregistrement..."
                  : "Enregistrer les modifications"}
              </button>
              <p
                className={`text-xs mt-2 text-center ${
                  saved ? "text-green-700" : "text-gray-500"
                }`}
              >
                {saved
                  ? "✓ Modifications enregistrées"
                  : "Enregistre la taille du logo, le texte et l'option date."}
              </p>
            </div>

            <Step
              number={3}
              title="QR code pour vos invités"
              description="Imprime un ticket avec un QR code. Vos invités le scannent pour envoyer leurs photos à l'imprimante."
            >
              <button
                onClick={printQRCode}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold touch-manipulation"
              >
                🖨️ Imprimer le QR code
              </button>
              {printError && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  {printError}
                </div>
              )}
            </Step>
          </div>

          <div className="lg:sticky lg:top-6 self-start rounded-xl border border-gray-200 bg-gray-50 p-4">
            <h3 className="font-semibold">Aperçu du ticket</h3>
            <p className="text-sm text-gray-500">
              Mis à jour en direct pendant que vous modifiez.
            </p>
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

function Step({
  number,
  title,
  description,
  children,
}: {
  number: number;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex gap-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-semibold flex items-center justify-center">
        {number}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500 mb-3">{description}</p>
        {children}
      </div>
    </section>
  );
}

import { unstable_noStore as noStore } from "next/cache";
