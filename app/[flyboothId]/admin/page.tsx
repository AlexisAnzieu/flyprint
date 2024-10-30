"use client";

import React, { useEffect, useRef, useState } from "react";
import { CLOUDINARY_FOLDER, cloudName, uploadPreset } from "@/lib/constants";

export default function Home({ params: { flyboothId } }: any) {
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

  useEffect(() => {
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

  return (
    <main className="min-h-screen flex justify-center items-center">
      <div className="flex flex-col items-center text-white w-full max-w-sm space-y-10">
        <div className="flex flex-col items-center bg-gray-800 p-6 rounded-xl w-full">
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
            <span className="text-xl sm:text-2xl text-center text-white">
              {isLoading ? "Envoie en cours..." : "Ajouter un logo 📷"}
            </span>
          </div>
          {uploadedImageUrl && (
            <div className="mt-4">
              <img
                src={uploadedImageUrl}
                alt="Uploaded"
                className="max-w-full h-auto"
              />
            </div>
          )}
          {error && (
            <div className="text-red-500 text-center mt-4">{error}</div>
          )}
        </div>

        <div className="flex flex-col items-center bg-gray-800 p-6 rounded-xl w-full">
          <textarea
            className="w-full p-4 rounded-xl text-black"
            rows={5}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Entrez votre texte ici..."
          />
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="addTime"
              checked={hasTime}
              onChange={(e) => setHasTime(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="addTime">{"Ajouter l'heure"}</label>
          </div>
          <button
            onClick={sendText}
            className={`mt-4 p-4 rounded-xl ${
              textLoading ? "bg-gray-500" : "bg-purple-500"
            } text-white`}
            disabled={textLoading}
          >
            {textLoading ? "Envoi en cours..." : "Mettre à jour"}
          </button>
          {textError && (
            <div className="text-red-500 text-center mt-4">{textError}</div>
          )}
        </div>
      </div>
    </main>
  );
}
