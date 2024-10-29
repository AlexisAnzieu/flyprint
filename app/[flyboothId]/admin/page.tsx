"use client";

import React, { useRef, useState } from "react";
import { CLOUDINARY_FOLDER, cloudName, uploadPreset } from "@/lib/constants";

export default function Home({ params: { flyboothId } }: any) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>(
    `https://res.cloudinary.com/dkbuiehgq/image/upload/v1730161876/flybooth/${flyboothId}/admin/logo`
  );

  function createFormData(uploadPreset: string, file: File) {
    const fd = new FormData();
    fd.append("folder", `${CLOUDINARY_FOLDER}/${flyboothId}/admin`);
    fd.append("upload_preset", uploadPreset);
    fd.append("file", file);
    fd.append("public_id", "logo");
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
      setUploadedImageUrl(response.secure_url);
    } catch (error) {
      setError("Erreur survenue lors de l'envoi de la photo");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className=" min-h-screen flex justify-center items-center">
      <div className="flex items-center text-white w-full max-w-4xl">
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
          className={`flex items-center justify-center cursor-pointer ${
            isLoading ? "bg-gray-500" : "bg-purple-500"
          } text-black p-4 rounded-xl`}
        >
          <span className="text-xl sm:text-2xl text-center  text-white">
            {isLoading ? "Envoie en cours..." : "Ajouter un logo 📷"}
          </span>
        </div>
        {uploadedImageUrl && (
          <div className="ml-10">
            <img
              src={uploadedImageUrl}
              alt="Uploaded"
              className="max-w-full h-auto"
            />
          </div>
        )}
        {error && <div className="text-red-500 text-center pb-20">{error}</div>}
      </div>
    </main>
  );
}
