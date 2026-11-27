/**
 * Neural Computer Vision Face Recognition Engine (@vladmandic/face-api)
 * Uses:
 *  1. SSD MobileNetV1 (+ TinyFaceDetector fallback) for neural face localization
 *  2. 68-Point Deep Landmark Net for geometric facial alignment
 *  3. ResNet-34 FaceRecognitionNet for 128-D L2-normalized metric embeddings
 * Model weights are served same-origin from /models (zero external CDN dependencies).
 */

export interface BiometricExtractionResult {
  ok: boolean;
  dataUrl?: string;
  embedding?: number[];
  qualityScore?: number;
  detectionScore?: number;
  modelName?: string;
  faceBox?: { x: number; y: number; width: number; height: number };
  width?: number;
  height?: number;
  error?: string;
}

const ALLOWED_MIMES = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);
const MODEL_URI = '/models';
const ACTIVE_MODEL_LABEL = 'SSD-MobileNetV1 + Landmark68 + ResNet34-128D';

type FaceApiModule = typeof import('@vladmandic/face-api');

let faceApiPromise: Promise<FaceApiModule> | null = null;
let modelsReadyPromise: Promise<FaceApiModule> | null = null;

async function loadFaceApi(): Promise<FaceApiModule> {
  if (typeof window === 'undefined') {
    throw new Error('Neural CV inference requires a browser runtime.');
  }
  if (!faceApiPromise) {
    faceApiPromise = import('@vladmandic/face-api');
  }
  return faceApiPromise;
}

export async function preloadFaceVisionModels(): Promise<FaceApiModule> {
  if (!modelsReadyPromise) {
    modelsReadyPromise = (async () => {
      const faceapi = await loadFaceApi();
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.isLoaded
          ? Promise.resolve()
          : faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URI),
        faceapi.nets.tinyFaceDetector.isLoaded
          ? Promise.resolve()
          : faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URI),
        faceapi.nets.faceLandmark68Net.isLoaded
          ? Promise.resolve()
          : faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URI),
        faceapi.nets.faceRecognitionNet.isLoaded
          ? Promise.resolve()
          : faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URI),
      ]);
      return faceapi;
    })().catch((err) => {
      modelsReadyPromise = null;
      throw err;
    });
  }
  return modelsReadyPromise;
}

function l2Normalize128(raw: Float32Array | number[]): number[] {
  const vec = Array.from(raw, (v) => Number(v));
  let normSq = 0;
  for (const v of vec) normSq += v * v;
  const invNorm = normSq > 1e-8 ? 1 / Math.sqrt(normSq) : 0;
  if (invNorm === 0) return [];
  return vec.map((v) => Number((v * invNorm).toFixed(6)));
}

function measureImageSharpnessAndExposure(img: HTMLImageElement): {
  quality: number;
  stdDev: number;
  mean: number;
} {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return { quality: 65, stdDev: 0.15, mean: 0.5 };

  ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, size, size);
  const { data } = ctx.getImageData(0, 0, size, size);

  const luma = new Float32Array(size * size);
  let sum = 0;
  let sumSq = 0;
  for (let i = 0; i < size * size; i++) {
    const y = (0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2]) / 255;
    luma[i] = y;
    sum += y;
    sumSq += y * y;
  }

  const mean = sum / (size * size);
  const stdDev = Math.sqrt(Math.max(0, sumSq / (size * size) - mean * mean));

  let edgeEnergy = 0;
  for (let y = 1; y < size - 1; y++) {
    for (let x = 1; x < size - 1; x++) {
      const gx = luma[y * size + (x + 1)] - luma[y * size + (x - 1)];
      const gy = luma[(y + 1) * size + x] - luma[(y - 1) * size + x];
      edgeEnergy += Math.sqrt(gx * gx + gy * gy);
    }
  }
  const avgEdge = edgeEnergy / ((size - 2) * (size - 2));
  const exposurePenalty = mean < 0.08 || mean > 0.94 ? 30 : 0;
  const quality = Math.min(99, Math.max(5, Math.round(stdDev * 170 + avgEdge * 145 - exposurePenalty)));
  return { quality, stdDev, mean };
}

export async function extractFaceDescriptorFromFile(file: File): Promise<BiometricExtractionResult> {
  if (!file) return { ok: false, error: 'No image file provided.' };
  if (file.type && !ALLOWED_MIMES.has(file.type.toLowerCase())) {
    return {
      ok: false,
      error: `Unsupported file type (${file.type}). Upload JPEG, PNG, or WebP portrait.`,
    };
  }
  if (file.size < 300) {
    return { ok: false, error: 'Image file is empty or corrupted (< 300 bytes).' };
  }
  if (file.size > 5 * 1024 * 1024) {
    return { ok: false, error: 'Image exceeds 5 MB limit.' };
  }

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Failed reading image file.'));
    reader.readAsDataURL(file);
  }).catch(() => '');

  if (!dataUrl) return { ok: false, error: 'Failed to decode uploaded file.' };
  return extractFaceDescriptorFromDataUrl(dataUrl);
}

export async function extractFaceDescriptorFromDataUrl(
  dataUrl: string,
): Promise<BiometricExtractionResult> {
  if (!dataUrl || !dataUrl.startsWith('data:image/')) {
    return { ok: false, error: 'Invalid image data URL.' };
  }

  const img = await new Promise<HTMLImageElement | null>((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = dataUrl;
  });

  if (!img || !img.naturalWidth || !img.naturalHeight) {
    return { ok: false, error: 'Corrupted or unreadable image data.' };
  }

  const width = img.naturalWidth;
  const height = img.naturalHeight;
  if (width < 48 || height < 48) {
    return {
      ok: false,
      width,
      height,
      qualityScore: 10,
      error: `Image resolution too low (${width}x${height}px; minimum 48x48 required).`,
    };
  }

  const { quality: imageQuality, stdDev } = measureImageSharpnessAndExposure(img);
  if (stdDev < 0.03 || imageQuality < 25) {
    return {
      ok: false,
      dataUrl,
      width,
      height,
      qualityScore: imageQuality,
      error: `Blank, blurred, or low-contrast frame (quality ${imageQuality}/100). Capture a clear facial photograph.`,
    };
  }

  // Run ResNet-34 + 68-landmark extraction on a normalized canvas (up to 720px) for speed & accuracy
  const maxDim = 720;
  const scale = Math.min(maxDim / width, maxDim / height, 1);
  const workW = Math.max(64, Math.round(width * scale));
  const workH = Math.max(64, Math.round(height * scale));
  const workCanvas = document.createElement('canvas');
  workCanvas.width = workW;
  workCanvas.height = workH;
  const workCtx = workCanvas.getContext('2d');
  if (!workCtx) {
    return { ok: false, error: 'Canvas 2D context unavailable for neural CV inference.' };
  }
  workCtx.drawImage(img, 0, 0, workW, workH);

  let detection:
    | {
        detection: { score: number; box: { x: number; y: number; width: number; height: number } };
        descriptor: Float32Array;
      }
    | undefined;

  try {
    const faceapi = await preloadFaceVisionModels();

    // Primary neural detector: SSD MobileNetV1 -> 68-point facial alignment -> ResNet-34 128-D descriptor
    detection = await faceapi
      .detectSingleFace(workCanvas, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.38 }))
      .withFaceLandmarks()
      .withFaceDescriptor();

    // Fast fallback detector: TinyFaceDetector for steeper angles or lower lighting
    if (!detection) {
      detection = await faceapi
        .detectSingleFace(
          workCanvas,
          new faceapi.TinyFaceDetectorOptions({ inputSize: 416, scoreThreshold: 0.3 }),
        )
        .withFaceLandmarks()
        .withFaceDescriptor();
    }
  } catch (err: any) {
    return {
      ok: false,
      width,
      height,
      qualityScore: imageQuality,
      error: err?.message || 'Failed running neural facial recognition models.',
    };
  }

  if (!detection || !detection.descriptor || detection.descriptor.length !== 128) {
    return {
      ok: false,
      dataUrl,
      width,
      height,
      qualityScore: Math.min(imageQuality, 34),
      modelName: ACTIVE_MODEL_LABEL,
      error:
        'No human face detected by SSD MobileNetV1. Center a clear, well-lit face inside the frame.',
    };
  }

  const normalized = l2Normalize128(detection.descriptor);
  if (normalized.length !== 128) {
    return {
      ok: false,
      width,
      height,
      qualityScore: 15,
      error: 'Neural biometric descriptor failed L2 normalization.',
    };
  }

  const detScore = Number(detection.detection.score.toFixed(3));
  const combinedQuality = Math.min(
    99,
    Math.max(45, Math.round(detScore * 55 + imageQuality * 0.45)),
  );

  let finalDataUrl = dataUrl;
  if (width > 720 || height > 720 || dataUrl.length > 600_000) {
    try {
      finalDataUrl = workCanvas.toDataURL('image/jpeg', 0.85);
    } catch {
      finalDataUrl = dataUrl;
    }
  }

  return {
    ok: true,
    dataUrl: finalDataUrl,
    embedding: normalized,
    qualityScore: combinedQuality,
    detectionScore: detScore,
    modelName: ACTIVE_MODEL_LABEL,
    faceBox: {
      x: Math.round(detection.detection.box.x),
      y: Math.round(detection.detection.box.y),
      width: Math.round(detection.detection.box.width),
      height: Math.round(detection.detection.box.height),
    },
    width,
    height,
  };
}
