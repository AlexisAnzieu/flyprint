"use client";

import React, { useEffect, useRef, useState, use } from "react";
import { IBM_Plex_Mono } from "next/font/google";
import { CLOUDINARY_FOLDER, cloudName, uploadPreset } from "@/lib/constants";

const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "600"] });

// Zigzag bottom edge, like a torn thermal ticket.
const ticketEdge = {
  WebkitMask:
    "conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg) 50% / 14px 100%",
  mask: "conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg) 50% / 14px 100%",
};

export default function Home(props: any) {
  const params: { flyboothId: string } = use(props.params);

  const { flyboothId } = params;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [printed, setPrinted] = useState<boolean>(false);
  const [userMessage, setUserMessage] = useState<string>("");
  // null = unknown, true = connected, false = not connected
  const [printerConnected, setPrinterConnected] = useState<boolean | null>(
    null,
  );

  useEffect(() => {
    fetch("/api/printer-status")
      .then((res) => res.json())
      .then((data) => setPrinterConnected(!!data.connected))
      .catch(() => setPrinterConnected(false));
  }, []);

  function createFormData(uploadPreset: string, file: File) {
    const fd = new FormData();
    fd.append("folder", `${CLOUDINARY_FOLDER}/${flyboothId}`);
    fd.append("upload_preset", uploadPreset);
    fd.append("file", file);
    return fd;
  }

  async function uploadFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      // Always reset file input so user can re-select the same file
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setIsLoading(true);
    setError(null);
    setPrinted(false);

    try {
      const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
      const fd = createFormData(uploadPreset, file);

      const res = await fetch(url, {
        method: "POST",
        body: fd,
      });
      const response: any = await res.json();

      if (response.error) {
        setError(response.error.message);
        return;
      }
      const printRaw = await fetch(
        `/api/print?pictureUrl=${
          response.secure_url
        }&flyboothId=${flyboothId}&userMessage=${encodeURIComponent(
          userMessage,
        )}`,
      );
      const printResponse = await printRaw.json();

      if (printResponse.error) {
        setError(printResponse.error);
        return;
      }

      setPrinted(true);
      setUserMessage("");
    } catch (error) {
      setError("Erreur survenue lors de l'envoi de la photo");
    } finally {
      setIsLoading(false);
      // Always reset file input so user can re-select the same file
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <main className="min-h-dvh bg-[#efebe3] text-[#161616]">
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 py-6 safe-area-pt safe-area-pb">
        <input
          aria-label="Prendre une photo"
          type="file"
          accept="image/*"
          capture="user"
          className="hidden"
          onChange={uploadFile}
          ref={fileInputRef}
        />

        <header
          className={`${mono.className} flex items-center justify-between border-b border-[#161616] pb-3 text-xs uppercase tracking-[0.2em]`}
        >
          <span className="font-semibold">Flybooth</span>
          <span className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${
                printerConnected === null
                  ? "bg-[#bbb]"
                  : printerConnected
                    ? "bg-[#2f9e5b]"
                    : "bg-[#e5484d]"
              }`}
            />
            {printerConnected === null
              ? "Imprimante"
              : printerConnected
                ? "Prête"
                : "Hors ligne"}
          </span>
        </header>

        <p className="mt-5 text-base text-[#555]">
          Prends un selfie : il s&apos;imprime tout de suite, avec ta légende en
          dessous.
        </p>

        <div
          className="mt-5 bg-[#fffdf8] px-5 pt-5 pb-8 shadow-[0_1px_0_rgba(0,0,0,0.04)]"
          style={ticketEdge}
        >
          <label
            htmlFor="caption"
            className={`${mono.className} flex justify-between text-[11px] uppercase tracking-[0.18em] text-[#777]`}
          >
            <span>Légende</span>
            <span>optionnel</span>
          </label>
          <textarea
            id="caption"
            className={`${mono.className} mt-3 w-full resize-none border-0 border-b border-dashed border-[#bbb] bg-transparent pb-2 text-[15px] leading-relaxed placeholder-[#aaa] focus:border-[#161616] focus:outline-none focus:ring-0`}
            rows={2}
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            placeholder="Ex. : Joyeux anniversaire Léa !"
            disabled={isLoading}
          />
          <p className={`${mono.className} mt-3 text-[11px] text-[#999]`}>
            Imprimée sous ta photo.
          </p>
        </div>

        <div className="mt-auto flex flex-col items-center pt-6 pb-4">
          <button
            type="button"
            onClick={() => !isLoading && fileInputRef.current?.click()}
            disabled={isLoading}
            aria-label="Prendre la photo"
            className="group relative flex h-24 w-24 items-center justify-center rounded-full border-[3px] border-[#161616] transition-transform active:scale-95 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="h-16 w-16 animate-spin rounded-full border-[3px] border-[#ccc] border-t-[#161616]" />
            ) : (
              <span className="h-[4.5rem] w-[4.5rem] rounded-full bg-[#161616] transition-colors group-hover:bg-[#e5484d]" />
            )}
          </button>
          <p className="mt-4 text-lg font-semibold">
            {isLoading ? "Impression en cours…" : "Prendre la photo"}
          </p>

          {printed && !isLoading && (
            <p
              role="status"
              className={`${mono.className} mt-3 text-center text-sm text-[#2f7d4f]`}
            >
              C&apos;est imprimé. Récupère ton ticket à l&apos;imprimante.
            </p>
          )}

          {error && (
            <p
              role="alert"
              className={`${mono.className} mt-3 w-full border border-[#e5484d] px-4 py-3 text-center text-sm text-[#b42318]`}
            >
              {error}
            </p>
          )}
        </div>

        <p className={`${mono.className} text-center text-[11px] text-[#888]`}>
          Astuce : face à la lumière, et ne bouge plus.
        </p>
      </div>
    </main>
  );
}
