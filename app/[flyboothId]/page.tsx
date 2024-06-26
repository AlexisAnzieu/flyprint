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
    <main className="bg-black min-h-screen flex items-center justify-center px-4 sm:px-0">
      <div className="flex flex-col items-center text-white">
        <input
          aria-label="File browser example"
          type="file"
          accept="image/*"
          capture="user"
          style={{ display: "none" }}
          onChange={uploadFile}
          ref={fileInputRef}
        />
        <button
          onClick={() => !isLoading && fileInputRef.current?.click()}
          className={`px-4 sm:px-10 py-3 sm:py-5 text-3xl sm:text-5xl rounded-xl mb-10 ${
            isLoading ? "bg-gray-500" : "bg-white"
          } text-black`}
          disabled={isLoading}
        >
          {isLoading
            ? "En impression..."
            : "Clique ici pour prendre une photo 📷"}
        </button>
        {error && <div className="text-red-500 text-center pb-20">{error}</div>}
        <div className=" text-xl sm:text-2xl text-center">
          (assure toi que la photo prise soit bien lumineuse)
        </div>
      </div>
    </main>
  );
}
