"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import barCounter from "@/public/printer/IMG_3449.jpg";
import printsOnTable from "@/public/printer/IMG_3601.jpg";
import printerFront from "@/public/printer/IMG_3602.jpg";
import printsInRow from "@/public/printer/IMG_3454.jpg";
import type { GalleryCopy } from "./content";
import styles from "./landing.module.css";

// Order matters: it drives the gallery layout and matches copy.alts.
// Static imports give Next the size and a blur placeholder for each photo.
const PHOTOS = [
  { src: barCounter, sizes: "(min-width: 900px) 35vw, 100vw" },
  { src: printerFront, sizes: "(min-width: 900px) 30vw, 50vw" },
  { src: printsOnTable, sizes: "(min-width: 900px) 30vw, 50vw" },
  { src: printsInRow, sizes: "(min-width: 900px) 55vw, 100vw" },
];

export default function PrinterGallery({ copy }: { copy: GalleryCopy }) {
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
            key={photo.src.src}
            type="button"
            className={styles.tile}
            onClick={() => show(i)}
            aria-label={`${copy.enlarge} ${copy.alts[i]}`}
          >
            <Image
              src={photo.src}
              alt={copy.alts[i]}
              fill
              sizes={photo.sizes}
              placeholder="blur"
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
              alt={copy.alts[open]}
              fill
              sizes="100vw"
              quality={85}
            />
          </div>
        )}
        <button type="button" className={styles.lightboxClose} onClick={close}>
          {copy.close}
        </button>
      </dialog>
    </>
  );
}
