"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { TicketCopy } from "./content";
import styles from "./landing.module.css";

// Same geometry as the real print job (see app/api/print/route.ts).
const PAPER_W = 576;
const PIC_W = 528;
const PIC_H = 712;
const INK: [number, number, number] = [26, 25, 29];
const PAPER: [number, number, number] = [252, 252, 250];
const TICKET_FONT = 'bold 26px "Courier New", Courier, monospace';
const LINE_H = 34;
const EVENT_TEXTS = ["#lea30ans"];
const DEFAULT_PHOTO = "/landing/party-photo.png";

// The printer strips accents (see removeAccents in the print route).
function removeAccents(str: string) {
  return str.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

// Atkinson dithering, in place: values end up 0 or 255.
function atkinson(g: Float32Array, w: number, h: number) {
  const spread: [number, number][] = [
    [1, 0],
    [2, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
    [0, 2],
  ];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      const old = g[i];
      const val = old < 128 ? 0 : 255;
      g[i] = val;
      const err = (old - val) / 8;
      for (const [dx, dy] of spread) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && nx < w && ny < h) g[ny * w + nx] += err;
      }
    }
  }
  return g;
}

// Contain-fit on white, like the server does before printing.
function photoToGray(img: HTMLImageElement) {
  const c = document.createElement("canvas");
  c.width = PIC_W;
  c.height = PIC_H;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, PIC_W, PIC_H);
  const scale = Math.min(PIC_W / img.naturalWidth, PIC_H / img.naturalHeight);
  const w = img.naturalWidth * scale;
  const h = img.naturalHeight * scale;
  ctx.drawImage(img, (PIC_W - w) / 2, (PIC_H - h) / 2, w, h);
  const d = ctx.getImageData(0, 0, PIC_W, PIC_H).data;
  const g = new Float32Array(PIC_W * PIC_H);
  for (let i = 0; i < g.length; i++) {
    g[i] = 0.299 * d[i * 4] + 0.587 * d[i * 4 + 1] + 0.114 * d[i * 4 + 2];
  }
  return g;
}

function wrap(ctx: CanvasRenderingContext2D, text: string, max: number) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > max && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

// Ticket layout, top to bottom: logo, photo, text block.
const LOGO_TOP = 40;
const PIC_TOP = LOGO_TOP + 200 + 40;
const TEXT_TOP = PIC_TOP + PIC_H;
const PIC_LEFT = (PAPER_W - PIC_W) / 2;

// 1-bit pass, in place: every pixel is either burnt (ink) or blank (paper).
function burn(img: ImageData) {
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const c = d[i] < 128 ? INK : PAPER;
    d[i] = c[0];
    d[i + 1] = c[1];
    d[i + 2] = c[2];
    d[i + 3] = 255;
  }
  return img;
}

// The event's logo, as an organiser would upload it. Drawn once, then reused.
function renderLogo(displayFont: string) {
  const c = document.createElement("canvas");
  c.width = PAPER_W;
  c.height = PIC_TOP;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, PAPER_W, PIC_TOP);
  ctx.fillStyle = "#000";
  ctx.strokeStyle = "#000";
  ctx.textAlign = "center";
  const mid = PAPER_W / 2;
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.arc(mid, LOGO_TOP + 70, 64, 0, Math.PI * 2);
  ctx.stroke();
  ctx.font = `900 66px ${displayFont}`;
  ctx.fillText("30", mid, LOGO_TOP + 94);
  ctx.font = `800 46px ${displayFont}`;
  ctx.fillText("Léa", mid, LOGO_TOP + 192);
  return burn(ctx.getImageData(0, 0, PAPER_W, PIC_TOP));
}

// A dithered photo, centred on a full-width strip of paper. Built once per photo.
function renderPhoto(dithered: Float32Array) {
  const img = new ImageData(PAPER_W, PIC_H);
  const d = img.data;
  for (let y = 0; y < PIC_H; y++) {
    for (let x = 0; x < PAPER_W; x++) {
      const inPic = x >= PIC_LEFT && x < PIC_LEFT + PIC_W;
      d[(y * PAPER_W + x) * 4] = inPic ? dithered[y * PIC_W + x - PIC_LEFT] : 255;
    }
  }
  return burn(img);
}

// Typing in the caption only redraws the text block: logo and photo are cached
// pixels, which keeps each keystroke cheap on slow phones.
function drawTicket(
  canvas: HTMLCanvasElement,
  logo: ImageData,
  photo: ImageData,
  caption: string,
) {
  const ctx = canvas.getContext("2d")!;
  ctx.font = TICKET_FONT;
  const captionLines = wrap(ctx, removeAccents(caption.trim()), PAPER_W - 48);
  const date = new Date().toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  let y = 30;
  const rows: { text: string; y: number }[] = [];
  for (const lines of [captionLines, EVENT_TEXTS, [date]]) {
    if (!lines.length) continue;
    y += 14;
    for (const text of lines) {
      rows.push({ text, y });
      y += LINE_H;
    }
  }
  const textH = y + 70;
  const height = TEXT_TOP + textH;

  if (canvas.height !== height) canvas.height = height;
  ctx.putImageData(logo, 0, 0);
  ctx.putImageData(photo, 0, PIC_TOP);

  ctx.fillStyle = "#fff";
  ctx.fillRect(0, TEXT_TOP, PAPER_W, textH);
  ctx.fillStyle = "#000";
  ctx.font = TICKET_FONT;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  for (const row of rows) ctx.fillText(row.text, PAPER_W / 2, TEXT_TOP + row.y + 24);
  ctx.putImageData(burn(ctx.getImageData(0, TEXT_TOP, PAPER_W, textH)), 0, TEXT_TOP);
}

export default function PrintingTicket({
  displayFont,
  copy,
}: {
  displayFont: string;
  copy: TicketCopy;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const logoRef = useRef<ImageData | null>(null);
  const photoRef = useRef<ImageData | null>(null);
  const [caption, setCaption] = useState(copy.defaultCaption);
  const [printId, setPrintId] = useState(0);
  const [ready, setReady] = useState(false);
  const [formatError, setFormatError] = useState(false);

  // The default photo is pre-dithered (scripts/render-party-photo.mts), so
  // first paint costs a small PNG instead of seconds of pixel maths.
  useEffect(() => {
    let cancelled = false;
    const photo = new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => {
        // An upload may have landed first: keep it.
        if (!photoRef.current) photoRef.current = renderPhoto(photoToGray(img));
        resolve();
      };
      img.onerror = () => resolve();
      img.src = DEFAULT_PHOTO;
    });
    const font = document.fonts
      .load(`800 46px ${displayFont}`)
      .catch(() => undefined);
    Promise.all([photo, font]).then(() => {
      if (cancelled) return;
      logoRef.current = renderLogo(displayFont);
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [displayFont]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!ready || !canvas || !logoRef.current || !photoRef.current) return;
    drawTicket(canvas, logoRef.current, photoRef.current, caption);
  }, [ready, caption, printId]);

  const onFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      photoRef.current = renderPhoto(atkinson(photoToGray(img), PIC_W, PIC_H));
      URL.revokeObjectURL(url);
      setFormatError(false);
      setPrintId((n) => n + 1);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      setFormatError(true);
    };
    img.src = url;
  }, []);

  return (
    <div className={styles.demo}>
      <div className={styles.stage}>
        <div className={styles.clip}>
          <div
            key={printId}
            className={`${styles.ticket} ${ready ? styles.feeding : styles.waiting}`}
          >
            <canvas
              ref={canvasRef}
              width={PAPER_W}
              height={1236}
              role="img"
              aria-label={copy.canvasLabel}
            />
          </div>
        </div>
        <div className={styles.printer} aria-hidden="true">
          <span className={styles.lip} />
          <span className={styles.emboss}>80 mm</span>
          <span className={styles.led} />
        </div>
      </div>

      <div className={styles.controls}>
        <label className={styles.field}>
          <span>{copy.captionLabel}</span>
          <input
            type="text"
            value={caption}
            maxLength={60}
            onChange={(e) => setCaption(e.target.value)}
          />
        </label>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className={styles.hidden}
          onChange={onFile}
          tabIndex={-1}
          aria-hidden="true"
        />
        <button
          type="button"
          className={styles.ghost}
          onClick={() => fileRef.current?.click()}
        >
          {copy.upload}
        </button>
        <p className={styles.note}>{copy.note}</p>
        {formatError && (
          <p role="alert" className={styles.error}>
            {copy.formatError}
          </p>
        )}
      </div>
    </div>
  );
}
