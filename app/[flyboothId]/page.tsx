"use client";

import React, { useRef, useState } from "react";
import { CLOUDINARY_FOLDER, cloudName, uploadPreset } from "@/lib/constants";

export default function Home({ params: { flyboothId } }: any) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function createFormData(uploadPreset: string, file: File) {
    const fd = new FormData();
    fd.append("folder", `${CLOUDINARY_FOLDER}/${flyboothId}`);
    fd.append("upload_preset", uploadPreset);
    fd.append("file", file);
    return fd;
  }

  async function uploadFile(e: React.ChangeEvent<HTMLInputElement>) {
    setIsLoading(true);
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
      const fd = createFormData(uploadPreset, e.target.files![0]);

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
        `/api/print?pictureUrl=${response.secure_url}&flyboothId=${flyboothId}`
      );
      const printResponse = await printRaw.json();
      if (printResponse.error) {
        setError(printResponse.error);
      }
    } catch (error) {
      setError("Erreur survenue lors de l'envoi de la photo");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="bg-gradient-to-br from-gray-950 via-purple-950/50 to-gray-950 min-h-screen flex justify-center safe-area-pt relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent)] animate-pulse-slow"></div>

      <div className="relative z-10 flex flex-col items-center text-white w-full max-w-lg mx-auto px-6 py-8">
        <input
          aria-label="File browser example"
          type="file"
          accept="image/*"
          capture="user"
          className="hidden"
          onChange={uploadFile}
          ref={fileInputRef}
        />

        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">📸 Flybooth</h1>
          <p className="text-gray-300 text-lg">Capture l&apos;éphémère</p>
        </div>

        {/* Main capture area */}
        <div
          onClick={() => !isLoading && fileInputRef.current?.click()}
          className={`capture-area mb-8 shadow-2xl transform transition-all duration-300 hover:scale-[1.02] hover:shadow-purple-500/20 h-[60vh] min-h-[350px]
            ${
              isLoading
                ? "bg-gradient-to-br from-gray-700 to-gray-800 cursor-not-allowed"
                : "bg-gradient-to-br from-white via-gray-50 to-white cursor-pointer hover:from-purple-50 hover:to-blue-50"
            } text-black border-2 border-white/20`}
        >
          {isLoading && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
          )}

          <div className="relative z-10 flex flex-col items-center justify-center h-full px-8">
            <div
              className={`text-6xl mb-4 ${
                isLoading ? "animate-bounce-gentle" : "animate-pulse"
              }`}
            >
              {isLoading ? "⏳" : "📸"}
            </div>
            <span className="text-2xl md:text-3xl text-center font-bold leading-tight text-shadow">
              {isLoading
                ? "Traitement de ton chef-d'œuvre..."
                : "Appuie ici pour le selfie"}
            </span>
            {!isLoading && (
              <div className="mt-4 text-lg text-gray-600 animate-bounce-gentle">
                ✨ Prêt quand tu l&apos;es !
              </div>
            )}
          </div>
        </div>

        {/* Error display */}
        {error && (
          <div className="error-card w-full max-w-md">
            <div className="flex items-center justify-center mb-2">
              <span className="text-2xl mr-2">⚠️</span>
              <span className="font-semibold">Oups !</span>
            </div>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Tips section */}
        <div className="glass-effect rounded-2xl p-6 mb-8 w-full max-w-md animate-slide-up">
          <div className="flex items-start space-x-3">
            <span className="text-2xl">💡</span>
            <div>
              <h3 className="font-semibold mb-2 text-yellow-300">
                Conseils Pro
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Pour de meilleurs résultats, trouve un endroit bien éclairé et
                tiens ton appareil bien stable!
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
