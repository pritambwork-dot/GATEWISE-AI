/**
 * Neural ANPR (Automatic Number Plate Recognition) Engine
 * Uses Tesseract.js LSTM Deep Neural Text Recognition configured with
 * strict license plate alphanumeric constraints and contrast pre-processing.
 */

export interface AnprResult {
  ok: boolean;
  plate?: string;
  rawText?: string;
  confidence?: number;
  modelName: string;
  error?: string;
}

const ANPR_MODEL_LABEL = 'Tesseract-LSTM-ANPR';

type TesseractWorker = import('tesseract.js').Worker;

let workerPromise: Promise<TesseractWorker> | null = null;

async function getAnprWorker(): Promise<TesseractWorker> {
  if (typeof window === 'undefined') {
    throw new Error('ANPR OCR requires a browser runtime.');
  }
  if (!workerPromise) {
    workerPromise = (async () => {
      const { createWorker, PSM } = await import('tesseract.js');
      const worker = await createWorker('eng');
      await worker.setParameters({
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
        tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
      });
      return worker;
    })().catch((err) => {
      workerPromise = null;
      throw err;
    });
  }
  return workerPromise;
}

/**
 * Normalizes noisy OCR output into the strongest license-plate candidate.
 * Prioritizes standard Indian RTO formats (e.g. OD02AB1234 / DL01C1234 / BH22AB1234)
 * before falling back to any continuous >= 5-char alphanumeric sequence.
 */
export function parseLicensePlateText(raw: string): string {
  const cleaned = raw.toUpperCase().replace(/[^A-Z0-9\s-]/g, ' ');
  const compact = cleaned.replace(/[\s-]+/g, '');

  // Standard RTO patterns: 2 letters + 2 digits + 1-3 letters + 3-4 digits
  const rtoMatch = compact.match(/[A-Z]{2}\d{1,2}[A-Z]{1,3}\d{3,4}/);
  if (rtoMatch) return rtoMatch[0];

  // Fallback: BH series or commercial / temporary alphanumeric plate token
  const bhMatch = compact.match(/\d{2}BH\d{4}[A-Z]{1,2}/);
  if (bhMatch) return bhMatch[0];

  const tokens = cleaned
    .split(/\s+/)
    .map((t) => t.replace(/[^A-Z0-9]/g, ''))
    .filter((t) => t.length >= 5 && /[A-Z]/.test(t) && /\d/.test(t));

  if (tokens.length > 0) return tokens[0].slice(0, 12);
  if (compact.length >= 5 && /[A-Z]/.test(compact) && /\d/.test(compact)) {
    return compact.slice(0, 12);
  }
  return '';
}

function preprocessImageForPlateOcr(
  source: HTMLImageElement | HTMLVideoElement,
  cropCenterStrip: boolean,
): HTMLCanvasElement | null {
  const srcW = source instanceof HTMLVideoElement ? source.videoWidth : source.naturalWidth;
  const srcH = source instanceof HTMLVideoElement ? source.videoHeight : source.naturalHeight;
  if (!srcW || !srcH) return null;

  const sx = cropCenterStrip ? Math.round(srcW * 0.12) : 0;
  const sy = cropCenterStrip ? Math.round(srcH * 0.3) : 0;
  const sw = cropCenterStrip ? Math.round(srcW * 0.76) : srcW;
  const sh = cropCenterStrip ? Math.round(srcH * 0.4) : srcH;

  const targetW = Math.min(960, Math.max(320, sw));
  const targetH = Math.max(120, Math.round((sh / sw) * targetW));

  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.drawImage(source, sx, sy, sw, sh, 0, 0, targetW, targetH);

  // Contrast stretch grayscale to sharpen stamped license plate characters
  const imgData = ctx.getImageData(0, 0, targetW, targetH);
  const d = imgData.data;
  let minL = 255;
  let maxL = 0;
  const lumas = new Uint8Array(targetW * targetH);
  for (let i = 0; i < targetW * targetH; i++) {
    const l = Math.round(0.299 * d[i * 4] + 0.587 * d[i * 4 + 1] + 0.114 * d[i * 4 + 2]);
    lumas[i] = l;
    if (l < minL) minL = l;
    if (l > maxL) maxL = l;
  }
  const span = Math.max(1, maxL - minL);
  for (let i = 0; i < targetW * targetH; i++) {
    const stretched = Math.round(((lumas[i] - minL) / span) * 255);
    d[i * 4] = stretched;
    d[i * 4 + 1] = stretched;
    d[i * 4 + 2] = stretched;
  }
  ctx.putImageData(imgData, 0, 0);
  return canvas;
}

export async function extractLicensePlateFromDataUrl(dataUrl: string): Promise<AnprResult> {
  if (!dataUrl || !dataUrl.startsWith('data:image/')) {
    return { ok: false, modelName: ANPR_MODEL_LABEL, error: 'Invalid vehicle image data URL.' };
  }

  const img = await new Promise<HTMLImageElement | null>((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = dataUrl;
  });

  if (!img) {
    return { ok: false, modelName: ANPR_MODEL_LABEL, error: 'Could not decode vehicle plate image.' };
  }

  const canvas = preprocessImageForPlateOcr(img, false);
  if (!canvas) {
    return { ok: false, modelName: ANPR_MODEL_LABEL, error: 'Canvas unavailable for ANPR OCR.' };
  }

  try {
    const worker = await getAnprWorker();
    const res = await worker.recognize(canvas);
    const rawText = (res.data?.text || '').trim();
    const plate = parseLicensePlateText(rawText);
    const confidence = Math.round(Number(res.data?.confidence || 0));

    if (!plate) {
      return {
        ok: false,
        rawText,
        confidence,
        modelName: ANPR_MODEL_LABEL,
        error: 'Could not read a valid plate from frame. Align the number plate or enter manually.',
      };
    }

    return { ok: true, plate, rawText, confidence, modelName: ANPR_MODEL_LABEL };
  } catch (err: any) {
    return {
      ok: false,
      modelName: ANPR_MODEL_LABEL,
      error: err?.message || 'ANPR neural OCR failed.',
    };
  }
}

export async function captureAndReadPlateFromVideo(
  videoEl: HTMLVideoElement,
): Promise<AnprResult> {
  if (!videoEl || videoEl.readyState < 2 || videoEl.videoWidth === 0) {
    return { ok: false, modelName: ANPR_MODEL_LABEL, error: 'Rear camera video stream not ready.' };
  }

  const canvas = preprocessImageForPlateOcr(videoEl, true);
  if (!canvas) {
    return { ok: false, modelName: ANPR_MODEL_LABEL, error: 'Failed capturing plate frame.' };
  }

  try {
    const worker = await getAnprWorker();
    const res = await worker.recognize(canvas);
    const rawText = (res.data?.text || '').trim();
    const plate = parseLicensePlateText(rawText);
    const confidence = Math.round(Number(res.data?.confidence || 0));

    if (!plate) {
      return {
        ok: false,
        rawText,
        confidence,
        modelName: ANPR_MODEL_LABEL,
        error: 'No clear plate detected in rear camera box. Enter plate manually or retry.',
      };
    }

    return { ok: true, plate, rawText, confidence, modelName: ANPR_MODEL_LABEL };
  } catch (err: any) {
    return {
      ok: false,
      modelName: ANPR_MODEL_LABEL,
      error: err?.message || 'ANPR OCR scan failed.',
    };
  }
}
