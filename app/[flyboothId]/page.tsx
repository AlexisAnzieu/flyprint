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
      const printRaw = await fetch(
        `/api/print?pictureUrl=${response.secure_url}`
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
    <main className="bg-black min-h-screen flex justify-center">
      <div className="flex flex-col items-center text-white w-full">
        <input
          aria-label="File browser example"
          type="file"
          accept="image/*"
          capture="user"
          style={{ display: "none" }}
          onChange={uploadFile}
          ref={fileInputRef}
        />
        <div
          onClick={() => !isLoading && fileInputRef.current?.click()}
          className={`w-full flex items-center justify-center mb-10 cursor-pointer ${
            isLoading ? "bg-gray-500" : "bg-white"
          } text-black`}
          style={{ height: "50vh" }}
        >
          <span className="text-3xl sm:text-5xl text-center">
            {isLoading
              ? "En impression..."
              : "Clique ici pour prendre une photo 📷"}
          </span>
        </div>
        {error && <div className="text-red-500 text-center pb-20">{error}</div>}
        <div className="text-xl sm:text-2xl text-center">
          (assure toi que la photo prise soit bien lumineuse)
        </div>
        <a
          href="https://www.flybooth.app/fr/nath/gallery"
          className="mt-10 px-8 py-4 bg-purple-500 text-white rounded-full"
        >
          Accède aux photos déjà prises
        </a>
      </div>
    </main>
  );
}
