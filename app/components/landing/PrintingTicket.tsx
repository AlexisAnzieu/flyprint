"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

// The printer strips accents (see removeAccents in the print route).
function removeAccents(str: string) {
  return str.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function hash(a: number, b: number) {
  let h = Math.imul(a, 374761393) + Math.imul(b, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

function mulberry(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
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

// A procedural party photo: a disco ball over a crowd, one guest taking a
// selfie. Grayscale, PIC_W x PIC_H.
function renderPartyPhoto() {
  const W = PIC_W;
  const H = PIC_H;
  const g = new Float32Array(W * H);
  const cx = W / 2;
  const cy = 285;
  const R = 190;
  const L = (() => {
    const v = [-0.5, -0.55, 0.67];
    const n = Math.hypot(v[0], v[1], v[2]);
    return v.map((c) => c / n);
  })();

  const beams = [
    [0.25, 0.05],
    [0.8, 0.035],
    [1.35, 0.05],
    [1.9, 0.03],
    [2.45, 0.045],
    [2.95, 0.03],
    [-2.7, 0.04],
    [-0.4, 0.035],
  ];

  const rand = mulberry(7);
  const spots = Array.from({ length: 46 }, () => ({
    x: rand() * W,
    y: rand() * H * 0.78,
    r: 2 + rand() * 6,
  })).filter((s) => Math.hypot(s.x - cx, s.y - cy) > R + 14);

  const sparkles = [
    { x: cx - 78, y: cy - 92, s: 46 },
    { x: cx + 70, y: cy + 60, s: 30 },
    { x: cx - 20, y: cy - 150, s: 18 },
  ];

  type Person = { x: number; y: number; r: number; phone?: boolean };
  const crowd: Person[] = [
    { x: 30, y: 612, r: 44 },
    { x: 140, y: 640, r: 38 },
    { x: 262, y: 598, r: 46, phone: true },
    { x: 388, y: 630, r: 40 },
    { x: 498, y: 608, r: 45 },
  ];

  const inCrowd = (x: number, y: number) => {
    for (const p of crowd) {
      if ((x - p.x) ** 2 + (y - p.y) ** 2 < p.r * p.r) return 1;
      const ex = (x - p.x) / (p.r * 1.95);
      const ey = (y - (p.y + p.r * 2.3)) / (p.r * 1.55);
      if (ex * ex + ey * ey < 1) return 1;
      if (p.phone) {
        // Raised arm, from the shoulder up to the phone.
        const ax = p.x + p.r * 1.25;
        const ay = p.y + p.r * 1.3;
        const bx = p.x + p.r * 1.95;
        const by = p.y - p.r * 1.75;
        const t = Math.max(
          0,
          Math.min(
            1,
            ((x - ax) * (bx - ax) + (y - ay) * (by - ay)) /
              ((bx - ax) ** 2 + (by - ay) ** 2),
          ),
        );
        const d = Math.hypot(x - (ax + t * (bx - ax)), y - (ay + t * (by - ay)));
        if (d < 9) return 1;
        const px = bx;
        const py = by - 30;
        if (Math.abs(x - px) < 18 && Math.abs(y - py) < 32) {
          // Phone flash.
          if ((x - (px - 7)) ** 2 + (y - (py - 20)) ** 2 < 22) return 2;
          return 1;
        }
      }
    }
    return 0;
  };

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const dx0 = x - cx;
      const dy0 = y - cy;
      const dist = Math.hypot(dx0, dy0);
      let v: number;

      if (dist < R) {
        const nx = dx0 / R;
        const ny = dy0 / R;
        const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
        const lat = Math.asin(-ny);
        const rows = 15;
        const rowF = ((lat + Math.PI / 2) / Math.PI) * rows;
        const ti = Math.floor(rowF);
        const fv = rowF - ti;
        const latC = ((ti + 0.5) / rows) * Math.PI - Math.PI / 2;
        const cols = Math.max(6, Math.round(38 * Math.cos(latC)));
        const lon = Math.atan2(nx, nz) + 0.35;
        const colF = ((lon + Math.PI) / (2 * Math.PI)) * cols;
        const tj = Math.floor(colF);
        const fu = colF - tj;
        const t = hash(ti, tj);
        const diffuse = Math.max(0, nx * L[0] + ny * L[1] + nz * L[2]);
        v = 30 + 190 * diffuse * (0.4 + 0.6 * t);
        if (t > 0.94) v = 255;
        const edge = 0.08 / Math.max(0.25, nz);
        if (fu < edge * 0.6 || fu > 1 - edge * 0.6 || fv < 0.07 || fv > 0.93)
          v = 12;
        v *= 0.5 + 0.5 * nz;
      } else {
        v = 14 + 50 * Math.exp(-(dist * dist) / (2 * 280 * 280));
        const ang = Math.atan2(dy0, dx0);
        const ramp = Math.min(1, (dist - R) / 90);
        for (const [a, w] of beams) {
          let d = Math.abs(ang - a);
          if (d > Math.PI) d = 2 * Math.PI - d;
          v += 120 * Math.exp(-(d * d) / (2 * w * w)) * ramp * Math.exp(-dist / 650);
        }
        for (const s of spots) {
          const d = Math.hypot(x - s.x, y - s.y);
          if (d < s.r * 2) v = Math.max(v, 250 * Math.max(0, 1 - d / (s.r * 2)) + 40);
        }
        // Chain holding the ball.
        if (Math.abs(dx0) < 2.5 && y < cy - R + 6) v = 150;
        // Haze over the dance floor, so the crowd reads as silhouettes.
        const floor = Math.max(0, Math.min(1, (y - (H - 300)) / 300));
        v += 95 * floor * floor;
      }

      for (const s of sparkles) {
        const ax = Math.abs(x - s.x);
        const ay = Math.abs(y - s.y);
        const star = Math.max(
          Math.exp(-ax / 1.6) * Math.exp(-ay / (s.s * 0.4)),
          Math.exp(-ay / 1.6) * Math.exp(-ax / (s.s * 0.4)),
        );
        const core = Math.exp(-(ax * ax + ay * ay) / 30);
        v = Math.max(v, 255 * Math.min(1, star * 1.3 + core));
      }

      const c = inCrowd(x, y);
      if (c === 1) v = 6;
      else if (c === 2) v = 255;

      g[y * W + x] = Math.max(0, Math.min(255, v));
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

export default function PrintingTicket({ displayFont }: { displayFont: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const photoRef = useRef<Float32Array | null>(null);
  const [caption, setCaption] = useState("Joyeux anniversaire !");
  const [printId, setPrintId] = useState(0);
  const [fontReady, setFontReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    photoRef.current = atkinson(renderPartyPhoto(), PIC_W, PIC_H);
    document.fonts
      .load(`800 46px ${displayFont}`)
      .catch(() => undefined)
      .then(() => {
        if (!cancelled) setFontReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [displayFont]);

  useEffect(() => {
    if (!fontReady || !canvasRef.current || !photoRef.current) return;
    drawTicket(canvasRef.current, photoRef.current, caption, displayFont);
  }, [fontReady, caption, printId, displayFont]);

  const onFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      photoRef.current = atkinson(photoToGray(img), PIC_W, PIC_H);
      URL.revokeObjectURL(url);
      setError(null);
      setPrintId((n) => n + 1);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      setError("Ce format ne s'ouvre pas dans le navigateur. Essayez un JPEG ou un PNG.");
    };
    img.src = url;
  }, []);

  return (
    <div className={styles.demo}>
      <div className={styles.stage}>
        <div className={styles.clip}>
          <div
            key={printId}
            className={`${styles.ticket} ${fontReady ? styles.feeding : styles.waiting}`}
          >
            <canvas
              ref={canvasRef}
              width={PAPER_W}
              height={1260}
              role="img"
              aria-label="Ticket imprimé : logo de l'événement, photo en noir et blanc, légende et heure"
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
          <span>Votre légende</span>
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
          Imprimer avec ma photo
        </button>
        <p className={styles.note}>
          Votre photo reste dans votre navigateur. Comme sur la vraie
          imprimante, les accents ne s&apos;impriment pas.
        </p>
        {error && (
          <p role="alert" className={styles.error}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
