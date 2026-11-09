"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import styles from "./landing.module.css";

// Order matters: it drives the gallery layout.
const PHOTOS = [
  {
    src: "/printer/IMG_3449.jpg",
    alt: "L'imprimante sur un comptoir de bar illuminé, entourée d'impressions",
  },
  {
    src: "/printer/IMG_3602.jpg",
    alt: "L'imprimante thermique, noire avec une bordure orange, un ticket qui sort",
  },
  {
    src: "/printer/IMG_3601.jpg",
    alt: "Des impressions d'une soirée à Montréal, avec le logo des organisateurs en haut",
  },
  {
    src: "/printer/IMG_3454.jpg",
    alt: "Des impressions alignées de chaque côté de l'imprimante",
  },
];

export default function PrinterGallery() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState<number | null>(null);

  const show = (i: number) => {
    setOpen(i);
    dialogRef.current?.showModal();
  };
  const close = () => dialogRef.current?.close();

  return (
    <>
      <div className={styles.gallery}>
        {PHOTOS.map((photo, i) => (
          <button
            key={photo.src}
            type="button"
            className={styles.tile}
            onClick={() => show(i)}
            aria-label={`Agrandir la photo : ${photo.alt}`}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes={i === 3 ? "(min-width: 900px) 60vw, 100vw" : "(min-width: 900px) 35vw, 100vw"}
            />
          </button>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        className={styles.lightbox}
        onClose={() => setOpen(null)}
        onClick={(e) => {
          // A click on the backdrop lands on the dialog element itself.
          if (e.target === e.currentTarget) close();
        }}
      >
        {open !== null && (
          <div className={styles.lightboxFrame}>
            <Image
              src={PHOTOS[open].src}
              alt={PHOTOS[open].alt}
              fill
              sizes="100vw"
              quality={85}
            />
          </div>
        )}
        <button type="button" className={styles.lightboxClose} onClick={close}>
          Fermer
        </button>
      </dialog>
    </>
  );
}
