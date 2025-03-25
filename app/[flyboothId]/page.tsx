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
    <main className="bg-black min-h-screen flex justify-center safe-area-pt">
      <div className="flex flex-col items-center text-white w-full max-w-lg mx-auto px-4 py-6">
        <input
          aria-label="File browser example"
          type="file"
          accept="image/*"
          capture="user"
          className="hidden"
          onChange={uploadFile}
          ref={fileInputRef}
        />
        <div
          onClick={() => !isLoading && fileInputRef.current?.click()}
          className={`w-full flex items-center justify-center mb-8 rounded-2xl 
            transition-colors duration-200 active:scale-98 touch-manipulation
            ${isLoading ? "bg-gray-600" : "bg-white"} text-black
            shadow-lg hover:shadow-xl`}
          style={{ height: "60vh", minHeight: "320px" }}
        >
          <span className="text-2xl md:text-4xl text-center px-6 font-medium">
            {isLoading
              ? "En impression... ⏳"
              : "Appuie ici pour prendre une photo 📸"}
          </span>
        </div>
        {error && (
          <div className="text-red-500 text-center py-4 px-6 bg-red-500/10 rounded-lg mb-6 animate-fade-in">
            {error}
          </div>
        )}
        <div className="text-lg md:text-xl text-center text-gray-300 px-6">
          Pour un meilleur résultat, prends ta photo dans un endroit bien
          éclairé
        </div>
        <a
          href={`https://www.flybooth.app/fr/${flyboothId}/gallery`}
          className="mt-8 px-8 py-4 bg-purple-600 hover:bg-purple-700 
            active:bg-purple-800 text-white rounded-full transition-colors 
            duration-200 text-lg font-medium shadow-lg hover:shadow-xl 
            active:scale-98 touch-manipulation"
        >
          Voir toutes les photos
        </a>
      </div>
    </main>
  );
}
