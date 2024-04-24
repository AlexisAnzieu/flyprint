"use client";

import React, { useRef } from "react";
import { CLOUDINARY_FOLDER, cloudName, uploadPreset } from "@/lib/constants";

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const flyboothId = "flyprint";

  function createFormData(uploadPreset: string, file: File) {
    const fd = new FormData();
    fd.append("folder", `${CLOUDINARY_FOLDER}/${flyboothId}`);
    fd.append("upload_preset", uploadPreset);
    fd.append("file", file);
    return fd;
  }

  async function uploadFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
    const fd = createFormData(uploadPreset, e.target.files![0]);

    fetch(url, {
      method: "POST",
      body: fd,
    }).then(async (res) => {
      const response: any = await res.json();
      fetch(`http://70.81.36.26:9100/print?pictureUrl=${response.secure_url}`);
    });
  }

  return (
    <main className="bg-black min-h-screen flex items-center justify-center">
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
          onClick={() => fileInputRef.current?.click()}
          className="px-10 py-5 text-5xl bg-white text-black rounded-xl mb-10"
        >
          Prend un selfie
        </button>
        <div className="text-2xl">
          (assure toi que la photo prise soit bien lumineuse)
        </div>
      </div>
    </main>
  );
}
