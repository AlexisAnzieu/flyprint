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

function drawTicket(
  canvas: HTMLCanvasElement,
  dithered: Float32Array,
  caption: string,
  displayFont: string,
) {
  const measure = canvas.getContext("2d")!;
  measure.font = TICKET_FONT;
  const captionLines = wrap(measure, removeAccents(caption.trim()), PAPER_W - 48);
  const date = new Date().toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const logoTop = 40;
  const logoH = 200;
  const picTop = logoTop + logoH + 40;
  let y = picTop + PIC_H + 30;
  const textRows: { text: string; y: number }[] = [];
  const push = (lines: string[]) => {
    if (!lines.length) return;
    y += 14;
    for (const text of lines) {
      textRows.push({ text, y });
      y += LINE_H;
    }
  };
  push(captionLines);
  push(EVENT_TEXTS);
  push([date]);
  const height = y + 70;

  canvas.width = PAPER_W;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, PAPER_W, height);
  ctx.fillStyle = "#000";
  ctx.strokeStyle = "#000";
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  // The event's logo, as an organiser would upload it.
  const mid = PAPER_W / 2;
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.arc(mid, logoTop + 70, 64, 0, Math.PI * 2);
  ctx.stroke();
  ctx.font = `900 66px ${displayFont}`;
  ctx.fillText("30", mid, logoTop + 94);
  ctx.font = `800 46px ${displayFont}`;
  ctx.fillText("Léa", mid, logoTop + 192);

  ctx.font = TICKET_FONT;
  for (const row of textRows) ctx.fillText(row.text, mid, row.y + 24);

  // 1-bit pass: everything is either burnt or blank.
  const img = ctx.getImageData(0, 0, PAPER_W, height);
  const d = img.data;
  const picLeft = (PAPER_W - PIC_W) / 2;
  for (let py = 0; py < height; py++) {
    for (let px = 0; px < PAPER_W; px++) {
      const i = (py * PAPER_W + px) * 4;
      let lum: number;
      const inPic =
        px >= picLeft && px < picLeft + PIC_W && py >= picTop && py < picTop + PIC_H;
      if (inPic) lum = dithered[(py - picTop) * PIC_W + (px - picLeft)];
      else lum = d[i];
      const c = lum < 128 ? INK : PAPER;
      d[i] = c[0];
      d[i + 1] = c[1];
      d[i + 2] = c[2];
      d[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
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
  const photoRef = useRef<Float32Array | null>(null);
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
        if (!photoRef.current) photoRef.current = photoToGray(img);
        resolve();
      };
      img.onerror = () => resolve();
      img.src = DEFAULT_PHOTO;
    });
    const font = document.fonts
      .load(`800 46px ${displayFont}`)
      .catch(() => undefined);
    Promise.all([photo, font]).then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [displayFont]);

  useEffect(() => {
    if (!ready || !canvasRef.current || !photoRef.current) return;
    drawTicket(canvasRef.current, photoRef.current, caption, displayFont);
  }, [ready, caption, printId, displayFont]);

  const onFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      photoRef.current = atkinson(photoToGray(img), PIC_W, PIC_H);
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
