'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const ASSETS = {
  heroPlate:
    'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261123_061107_c3030a30-c49e-4b74-be3f-c8a0750c193b.png&w=1344&q=85',
  s2Plate:
    'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261123_061140_af2262a5-c52c-472a-be3c-ccfbdf621c3a.png&w=1344&q=85',
  mounds:
    'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261123_071757_11ac0e5d-35f5-4e49-bdab-2cee6a7a2ae3.png&w=1344&q=85',
  cards:
    'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261123_061140_b66e0e91-d128-4f2f-9076-3a6fee12924e.png&w=1024&q=85',
  video:
    'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261123_061238_19527355-b1cd-46dc-b72e-6eb7e0efd788.mp4',
};

const QOUT = 'cubic-bezier(.25,1,.5,1)';
const COUT = 'cubic-bezier(.33,1,.68,1)';
const CIN = 'cubic-bezier(.32,0,.67,0)';

const WORD_LETTERS = ['G', 'a', 't', 'e', 'w', 'i', 's', 'e'];
const LETTER_DELAYS = [0, 100, 270, 240, 200, 320, 150, 370];

interface Mp4Sample {
  offset: number;
  size: number;
  timestampUs: number;
  durationUs: number;
  isKey: boolean;
}

interface ParsedMp4 {
  codec: string;
  description: Uint8Array;
  width: number;
  height: number;
  samples: Mp4Sample[];
}

function readU32(view: DataView, offset: number): number {
  return view.getUint32(offset, false);
}

function readU64(view: DataView, offset: number): number {
  const hi = view.getUint32(offset, false);
  const lo = view.getUint32(offset + 4, false);
  return hi * 4294967296 + lo;
}

function readType(bytes: Uint8Array, offset: number): string {
  return String.fromCharCode(bytes[offset], bytes[offset + 1], bytes[offset + 2], bytes[offset + 3]);
}

function findBoxes(bytes: Uint8Array, start: number, end: number): Array<{ type: string; start: number; dataStart: number; end: number }> {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const out: Array<{ type: string; start: number; dataStart: number; end: number }> = [];
  let pos = start;
  while (pos + 8 <= end) {
    let size = readU32(view, pos);
    const type = readType(bytes, pos + 4);
    let headerSize = 8;
    if (size === 1 && pos + 16 <= end) {
      size = readU64(view, pos + 8);
      headerSize = 16;
    } else if (size === 0) {
      size = end - pos;
    }
    if (size < headerSize || pos + size > end) break;
    out.push({ type, start: pos, dataStart: pos + headerSize, end: pos + size });
    pos += size;
  }
  return out;
}

function parseMp4VideoTrack(buffer: ArrayBuffer): ParsedMp4 | null {
  try {
    const bytes = new Uint8Array(buffer);
    const view = new DataView(buffer);
    const top = findBoxes(bytes, 0, bytes.length);
    const moov = top.find((b) => b.type === 'moov');
    if (!moov) return null;

    const traks = findBoxes(bytes, moov.dataStart, moov.end).filter((b) => b.type === 'trak');
    for (const trak of traks) {
      const mdia = findBoxes(bytes, trak.dataStart, trak.end).find((b) => b.type === 'mdia');
      if (!mdia) continue;
      const mdiaKids = findBoxes(bytes, mdia.dataStart, mdia.end);
      const mdhd = mdiaKids.find((b) => b.type === 'mdhd');
      const hdlr = mdiaKids.find((b) => b.type === 'hdlr');
      const minf = mdiaKids.find((b) => b.type === 'minf');
      if (!mdhd || !hdlr || !minf) continue;

      const hdlrType = readType(bytes, hdlr.dataStart + 8);
      if (hdlrType !== 'vide') continue;

      const mdhdVer = bytes[mdhd.dataStart];
      const timescale = mdhdVer === 1 ? readU32(view, mdhd.dataStart + 20) : readU32(view, mdhd.dataStart + 12);

      const stbl = findBoxes(bytes, minf.dataStart, minf.end).find((b) => b.type === 'stbl');
      if (!stbl) continue;
      const stblKids = findBoxes(bytes, stbl.dataStart, stbl.end);

      const stsd = stblKids.find((b) => b.type === 'stsd');
      const stts = stblKids.find((b) => b.type === 'stts');
      const stsc = stblKids.find((b) => b.type === 'stsc');
      const stsz = stblKids.find((b) => b.type === 'stsz');
      const stco = stblKids.find((b) => b.type === 'stco');
      const co64 = stblKids.find((b) => b.type === 'co64');
      const stss = stblKids.find((b) => b.type === 'stss');
      if (!stsd || !stsc || !stsz || (!stco && !co64)) continue;

      // stsd -> entry 1 (starts at stsd.dataStart + 8)
      const entryStart = stsd.dataStart + 8;
      const entryEnd = Math.min(stsd.end, entryStart + readU32(view, entryStart));
      const width = view.getUint16(entryStart + 32, false);
      const height = view.getUint16(entryStart + 34, false);

      // VisualSampleEntry header is 86 bytes (box header 8 + 78 bytes)
      const visualSub = findBoxes(bytes, entryStart + 86, entryEnd);
      const avcC = visualSub.find((b) => b.type === 'avcC');
      if (!avcC) continue;

      const description = bytes.slice(avcC.dataStart, avcC.end);
      const profile = description[1].toString(16).padStart(2, '0');
      const compat = description[2].toString(16).padStart(2, '0');
      const level = description[3].toString(16).padStart(2, '0');
      const codec = `avc1.${profile}${compat}${level}`;

      // Sample sizes (stsz)
      const constantSize = readU32(view, stsz.dataStart + 4);
      const sampleCount = readU32(view, stsz.dataStart + 8);
      const sizes: number[] = new Array(sampleCount);
      for (let i = 0; i < sampleCount; i++) {
        sizes[i] = constantSize !== 0 ? constantSize : readU32(view, stsz.dataStart + 12 + i * 4);
      }

      // Chunk offsets (stco or co64)
      const chunkOffsets: number[] = [];
      if (stco) {
        const count = readU32(view, stco.dataStart + 4);
        for (let i = 0; i < count; i++) {
          chunkOffsets.push(readU32(view, stco.dataStart + 8 + i * 4));
        }
      } else if (co64) {
        const count = readU32(view, co64.dataStart + 4);
        for (let i = 0; i < count; i++) {
          chunkOffsets.push(readU64(view, co64.dataStart + 8 + i * 8));
        }
      }

      // Sample-to-chunk (stsc)
      const stscCount = readU32(view, stsc.dataStart + 4);
      const stscEntries: Array<{ firstChunk: number; samplesPerChunk: number }> = [];
      for (let i = 0; i < stscCount; i++) {
        const base = stsc.dataStart + 8 + i * 12;
        stscEntries.push({
          firstChunk: readU32(view, base),
          samplesPerChunk: readU32(view, base + 4),
        });
      }

      const sampleOffsets: number[] = new Array(sampleCount);
      let sIdx = 0;
      for (let chunkIdx = 0; chunkIdx < chunkOffsets.length && sIdx < sampleCount; chunkIdx++) {
        const chunkNum = chunkIdx + 1;
        let samplesInChunk = stscEntries[0]?.samplesPerChunk ?? 1;
        for (let e = 0; e < stscEntries.length; e++) {
          if (chunkNum >= stscEntries[e].firstChunk) samplesInChunk = stscEntries[e].samplesPerChunk;
          else break;
        }
        let cursor = chunkOffsets[chunkIdx];
        for (let k = 0; k < samplesInChunk && sIdx < sampleCount; k++) {
          sampleOffsets[sIdx] = cursor;
          cursor += sizes[sIdx];
          sIdx++;
        }
      }

      // Sync samples (stss)
      const keySet = new Set<number>();
      if (stss) {
        const keyCount = readU32(view, stss.dataStart + 4);
        for (let i = 0; i < keyCount; i++) {
          keySet.add(readU32(view, stss.dataStart + 8 + i * 4) - 1);
        }
      } else {
        for (let i = 0; i < sampleCount; i++) keySet.add(i);
      }

      // Sample durations (stts)
      const durations: number[] = new Array(sampleCount).fill(Math.round(timescale / 24));
      if (stts) {
        const entryCount = readU32(view, stts.dataStart + 4);
        let dIdx = 0;
        for (let i = 0; i < entryCount; i++) {
          const cnt = readU32(view, stts.dataStart + 8 + i * 8);
          const delta = readU32(view, stts.dataStart + 12 + i * 8);
          for (let j = 0; j < cnt && dIdx < sampleCount; j++) {
            durations[dIdx++] = delta;
          }
        }
      }

      const samples: Mp4Sample[] = [];
      let accumTicks = 0;
      for (let i = 0; i < sampleCount; i++) {
        const durUs = Math.round((durations[i] / timescale) * 1_000_000);
        const tsUs = Math.round((accumTicks / timescale) * 1_000_000);
        accumTicks += durations[i];
        samples.push({
          offset: sampleOffsets[i],
          size: sizes[i],
          timestampUs: tsUs,
          durationUs: durUs,
          isKey: keySet.has(i),
        });
      }

      return { codec, description, width, height, samples };
    }
    return null;
  } catch {
    return null;
  }
}

function buildSection2Keyframes(reverse: boolean): Keyframe[] {
  const frames: Keyframe[] = [];
  const steps = 54;
  for (let k = 0; k <= steps; k++) {
    const t = (k / steps) * 1.8;
    let f: number;
    if (k === steps) {
      f = 0;
    } else if (t < 0.47) {
      f = 1 - 1.506 * t;
    } else {
      f = 0.293 * Math.exp(-(t - 0.47) / 0.232);
    }
    const frac = reverse ? 1 - f : f;
    frames.push({
      offset: k / steps,
      transform: `translateY(${(frac * window.innerHeight).toFixed(2)}px)`,
      opacity: 1,
    });
  }
  return frames;
}

export default function EmbersGatewiseLanding() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [filmOpen, setFilmOpen] = useState(false);

  const stageRef = useRef<HTMLElement>(null);
  const h1PlateRef = useRef<HTMLImageElement>(null);
  const s2PlateRef = useRef<HTMLImageElement>(null);
  const camCanvasRef = useRef<HTMLCanvasElement>(null);
  const fgRef = useRef<HTMLDivElement>(null);
  const moundLRef = useRef<HTMLImageElement>(null);
  const moundRRef = useRef<HTMLImageElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<(HTMLElement | null)[]>([]);
  const navLinkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const glyphsRef = useRef<HTMLDivElement>(null);
  const h1TitleSpanRef = useRef<HTMLSpanElement>(null);
  const h1BodySpanRef = useRef<HTMLSpanElement>(null);
  const videoCardRef = useRef<HTMLAnchorElement>(null);
  const playSvgRef = useRef<SVGSVGElement>(null);
  const captionRowRefs = useRef<(HTMLDivElement | null)[]>([]);

  const s2TitleRef = useRef<HTMLHeadingElement>(null);
  const s2BodyRef = useRef<HTMLParagraphElement>(null);
  const s2ArrowRef = useRef<HTMLAnchorElement>(null);
  const s2CardRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const goToRef = useRef<(target: 0 | 1) => void>(() => {});

  // Lock document scroll only while on landing page
  useEffect(() => {
    document.documentElement.classList.add('gw-stage-lock');
    return () => {
      document.documentElement.classList.remove('gw-stage-lock');
    };
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let currentState: 0 | 1 = 0;
    let locked = true;
    const runningAnims: Animation[] = [];
    const timers: number[] = [];
    let cameraRafId: number | null = null;
    let disposed = false;

    const frameBlobs: Blob[] = [];
    const bitmapCache = new Map<number, ImageBitmap>();
    const decodingIndices = new Set<number>();
    let lastDrawnFrame = -1;
    let currentCamProgress = 0;
    let moundCleanUrl: string | null = null;

    const pushTimer = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => {
        if (!disposed) fn();
      }, ms);
      timers.push(id);
      return id;
    };

    const runAnim = (
      el: Element | null | undefined,
      keyframes: Keyframe[] | PropertyIndexedKeyframes,
      options: KeyframeAnimationOptions,
    ) => {
      if (!el) return;
      const anim = el.animate(keyframes, { fill: 'both', ...options });
      runningAnims.push(anim);
      return anim;
    };

    const commitAndCancelAll = () => {
      for (const id of timers) window.clearTimeout(id);
      timers.length = 0;
      if (cameraRafId !== null) {
        cancelAnimationFrame(cameraRafId);
        cameraRafId = null;
      }
      while (runningAnims.length > 0) {
        const anim = runningAnims.pop()!;
        try {
          anim.commitStyles();
        } catch {
          // ignore elements disconnected or unrendered
        }
        anim.cancel();
      }
    };

    // ------------------------------------------------------------------
    // 1. Clean Mounds Edge (chroma spill removal -> single shared blob URL)
    // ------------------------------------------------------------------
    const prepareMounds = (): Promise<void> =>
      new Promise((resolve) => {
        let done = false;
        const finish = () => {
          if (!done) {
            done = true;
            resolve();
          }
        };
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          try {
            const c = document.createElement('canvas');
            c.width = img.naturalWidth || 1344;
            c.height = img.naturalHeight || 752;
            const ctx = c.getContext('2d');
            if (!ctx) return finish();
            ctx.drawImage(img, 0, 0, c.width, c.height);
            const imgData = ctx.getImageData(0, 0, c.width, c.height);
            const data = imgData.data;
            const smoothstep = (e0: number, e1: number, x: number) => {
              const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
              return t * t * (3 - 2 * t);
            };
            for (let i = 0; i < data.length; i += 4) {
              const a = data[i + 3];
              if (a === 0) continue;
              const r = data[i];
              const g = data[i + 1];
              const b = data[i + 2];
              const m = Math.max(r, b);
              const d = (g - m) / 255;
              if (d > 0) {
                data[i + 3] = Math.round(a * (1 - smoothstep(0.10, 0.38, d)));
                data[i + 1] = Math.min(g, Math.round(m * 0.96));
              }
            }
            ctx.putImageData(imgData, 0, 0);
            c.toBlob((blob) => {
              if (!blob || disposed) return finish();
              moundCleanUrl = URL.createObjectURL(blob);
              const ml = moundLRef.current;
              const mr = moundRRef.current;
              if (ml && mr) {
                ml.src = moundCleanUrl;
                mr.src = moundCleanUrl;
                Promise.all([
                  ml.decode().catch(() => {}),
                  mr.decode().catch(() => {}),
                ]).finally(finish);
              } else {
                finish();
              }
            }, 'image/png');
          } catch {
            finish();
          }
        };
        img.onerror = finish;
        img.src = ASSETS.mounds;
      });

    // ------------------------------------------------------------------
    // 2. Hero plate decode readiness
    // ------------------------------------------------------------------
    const prepareHeroPlate = (): Promise<void> =>
      new Promise((resolve) => {
        const h1 = h1PlateRef.current;
        if (!h1) return resolve();
        if (h1.complete) {
          h1.decode().catch(() => {}).finally(resolve);
          return;
        }
        const onLoad = () => {
          h1.decode().catch(() => {}).finally(resolve);
        };
        h1.addEventListener('load', onLoad, { once: true });
        h1.addEventListener('error', () => resolve(), { once: true });
      });

    // ------------------------------------------------------------------
    // 3. Camera Clip Frame Cache (1.2s after mount -> WebCodecs or RVFC fallback)
    // ------------------------------------------------------------------
    const decodeFrameRange = (targetIdx: number, dir: 1 | -1) => {
      if (frameBlobs.length === 0) return;
      const total = frameBlobs.length;
      const queueFrame = (idx: number) => {
        if (idx < 0 || idx >= total) return;
        if (bitmapCache.has(idx) || decodingIndices.has(idx)) return;
        if (decodingIndices.size >= 4) return;
        decodingIndices.add(idx);
        createImageBitmap(frameBlobs[idx])
          .then((bmp) => {
            if (disposed) {
              bmp.close();
              return;
            }
            bitmapCache.set(idx, bmp);
            if (bitmapCache.size > 24) {
              for (const [k, oldBmp] of Array.from(bitmapCache.entries())) {
                if (Math.abs(k - targetIdx) > 10) {
                  oldBmp.close();
                  bitmapCache.delete(k);
                }
              }
            }
          })
          .catch(() => {})
          .finally(() => {
            decodingIndices.delete(idx);
          });
      };

      queueFrame(targetIdx);
      for (let step = 1; step <= 6; step++) {
        queueFrame(targetIdx + step * dir);
      }
    };

    const drawFrameToCanvas = (targetIdx: number, dir: 1 | -1) => {
      const canvas = camCanvasRef.current;
      if (!canvas || frameBlobs.length === 0) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      decodeFrameRange(targetIdx, dir);

      let chosen: number | null = bitmapCache.has(targetIdx) ? targetIdx : null;
      if (chosen === null) {
        if (dir >= 0) {
          for (let i = targetIdx; i >= 0; i--) {
            if (bitmapCache.has(i)) {
              chosen = i;
              break;
            }
          }
        } else {
          for (let i = targetIdx; i < frameBlobs.length; i++) {
            if (bitmapCache.has(i)) {
              chosen = i;
              break;
            }
          }
        }
      }
      if (chosen !== null && chosen !== lastDrawnFrame) {
        const bmp = bitmapCache.get(chosen);
        if (bmp) {
          ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
          lastDrawnFrame = chosen;
        }
      }
    };

    const buildCacheWithRvfc = async () => {
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.muted = true;
      video.playsInline = true;
      video.preload = 'auto';
      video.src = ASSETS.video;

      const off = document.createElement('canvas');
      off.width = 1280;
      off.height = 720;
      const octx = off.getContext('2d');
      if (!octx) return;

      const captured: Array<{ ts: number; blob: Blob }> = [];
      await new Promise<void>((resolve) => {
        const finish = () => {
          video.pause();
          video.removeAttribute('src');
          resolve();
        };
        video.addEventListener('ended', finish, { once: true });
        video.addEventListener('error', finish, { once: true });

        const hasRvfc = 'requestVideoFrameCallback' in video;
        const captureStep = (_now: number, meta?: { mediaTime?: number }) => {
          if (disposed || video.ended) return finish();
          octx.drawImage(video, 0, 0, 1280, 720);
          const ts = meta?.mediaTime ?? video.currentTime;
          off.toBlob(
            (b) => {
              if (b) captured.push({ ts, blob: b });
            },
            'image/jpeg',
            0.86,
          );
          if (hasRvfc) {
            (video as unknown as { requestVideoFrameCallback: (cb: (n: number, m: { mediaTime: number }) => void) => void }).requestVideoFrameCallback(captureStep);
          }
        };

        video
          .play()
          .then(() => {
            if (hasRvfc) {
              (video as unknown as { requestVideoFrameCallback: (cb: (n: number, m: { mediaTime: number }) => void) => void }).requestVideoFrameCallback(captureStep);
            } else {
              finish();
            }
          })
          .catch(finish);
      });

      captured.sort((a, b) => a.ts - b.ts);
      if (captured.length > 20 && frameBlobs.length === 0) {
        for (const item of captured) frameBlobs.push(item.blob);
      }
    };

    const buildCacheWithWebCodecs = async () => {
      if (typeof VideoDecoder === 'undefined') {
        await buildCacheWithRvfc();
        return;
      }
      try {
        const res = await fetch(ASSETS.video, { mode: 'cors' });
        if (!res.ok) throw new Error('Video fetch failed');
        const buf = await res.arrayBuffer();
        const parsed = parseMp4VideoTrack(buf);
        if (!parsed || parsed.samples.length === 0) throw new Error('MP4 parse failed');

        const off = document.createElement('canvas');
        off.width = 1280;
        off.height = 720;
        const octx = off.getContext('2d');
        if (!octx) throw new Error('No 2D context');

        const encodedFrames: Array<{ ts: number; blob: Blob }> = [];
        const pendingBlobs: Promise<void>[] = [];

        await new Promise<void>((resolve, reject) => {
          const decoder = new VideoDecoder({
            output: (frame) => {
              try {
                octx.drawImage(frame, 0, 0, 1280, 720);
                const ts = frame.timestamp ?? 0;
                frame.close();
                const p = new Promise<void>((resBlob) => {
                  off.toBlob(
                    (b) => {
                      if (b) encodedFrames.push({ ts, blob: b });
                      resBlob();
                    },
                    'image/jpeg',
                    0.86,
                  );
                });
                pendingBlobs.push(p);
              } catch {
                frame.close();
              }
            },
            error: (err) => reject(err),
          });

          decoder.configure({
            codec: parsed.codec,
            codedWidth: parsed.width,
            codedHeight: parsed.height,
            description: parsed.description,
          });

          const bytes = new Uint8Array(buf);
          for (const sample of parsed.samples) {
            const chunk = new EncodedVideoChunk({
              type: sample.isKey ? 'key' : 'delta',
              timestamp: sample.timestampUs,
              duration: sample.durationUs,
              data: bytes.subarray(sample.offset, sample.offset + sample.size),
            });
            decoder.decode(chunk);
          }

          decoder
            .flush()
            .then(async () => {
              await Promise.all(pendingBlobs);
              decoder.close();
              resolve();
            })
            .catch(reject);
        });

        encodedFrames.sort((a, b) => a.ts - b.ts);
        for (const item of encodedFrames) frameBlobs.push(item.blob);
      } catch {
        await buildCacheWithRvfc();
      }
    };

    const cacheTimerId = window.setTimeout(() => {
      if (!disposed && !prefersReduced) {
        buildCacheWithWebCodecs();
      }
    }, 1200);

    const runCamera = (forward: boolean, delay: number, duration: number) => {
      const s2Plate = s2PlateRef.current;
      const cacheReady = frameBlobs.length > 20;

      if (!cacheReady || prefersReduced) {
        runAnim(
          s2Plate,
          forward ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: 1 }, { opacity: 0 }],
          { delay, duration, easing: COUT },
        );
        return;
      }

      pushTimer(() => {
        stage.classList.add('cam-on');
        const startP = forward ? 0 : 1;
        const endP = forward ? 1 : 0;
        const dir: 1 | -1 = forward ? 1 : -1;
        const startTime = performance.now();

        const tick = (now: number) => {
          if (disposed) return;
          const x = Math.min(1, Math.max(0, (now - startTime) / duration));
          const eased = 1 - Math.pow(1 - x, 3);
          currentCamProgress = startP + (endP - startP) * eased;
          const idx = Math.round(currentCamProgress * (frameBlobs.length - 1));
          drawFrameToCanvas(idx, dir);

          if (x < 1) {
            cameraRafId = requestAnimationFrame(tick);
          } else {
            cameraRafId = null;
            if (s2Plate) s2Plate.style.opacity = forward ? '1' : '0';
            if (!forward) stage.classList.remove('cam-on');
          }
        };

        // Pre-warm initial frame immediately
        drawFrameToCanvas(Math.round(startP * (frameBlobs.length - 1)), dir);
        cameraRafId = requestAnimationFrame(tick);
      }, delay);
    };

    // ------------------------------------------------------------------
    // 4. Play Hero Entrance (used on initial load AND reverse replay)
    // ------------------------------------------------------------------
    const playHeroEntrance = (baseOffset: number, isReplay: boolean) => {
      if (!isReplay) {
        runAnim(
          h1PlateRef.current,
          [{ transform: 'scale(1.3)' }, { transform: 'none' }],
          { delay: baseOffset + 0, duration: 1350, easing: QOUT },
        );
        navLinkRefs.current.forEach((link, i) => {
          runAnim(
            link,
            [{ transform: 'translateY(-110%)' }, { transform: 'none' }],
            { delay: baseOffset + 100 + i * 100, duration: 300, easing: COUT },
          );
        });
        runAnim(
          menuBtnRef.current,
          [{ opacity: 0 }, { opacity: 1 }],
          { delay: baseOffset + 530, duration: 200, easing: 'linear' },
        );
        runAnim(
          glyphsRef.current,
          [
            { opacity: 0, transform: 'translateX(10px)' },
            { opacity: 1, transform: 'none' },
          ],
          { delay: baseOffset + 600, duration: 400, easing: COUT },
        );
      }

      runAnim(
        moundRRef.current,
        [{ transform: 'translateX(45%)' }, { transform: 'none' }],
        { delay: baseOffset + 0, duration: 1700, easing: QOUT },
      );
      runAnim(
        moundLRef.current,
        [{ transform: 'translateX(-45%)' }, { transform: 'none' }],
        { delay: baseOffset + 40, duration: 1700, easing: QOUT },
      );
      runAnim(
        h1TitleSpanRef.current,
        [{ transform: 'translateY(-100%)' }, { transform: 'none' }],
        { delay: baseOffset + 390, duration: 950, easing: COUT },
      );
      runAnim(
        h1BodySpanRef.current,
        [{ transform: 'translateY(100%)' }, { transform: 'none' }],
        { delay: baseOffset + 450, duration: 900, easing: COUT },
      );
      runAnim(
        videoCardRef.current,
        [{ opacity: 0 }, { opacity: 1 }],
        { delay: baseOffset + 570, duration: 260, easing: 'linear' },
      );

      letterRefs.current.forEach((el, i) => {
        runAnim(
          el,
          [
            { opacity: 0, transform: 'translateY(.06em)' },
            { opacity: 1, transform: 'none' },
          ],
          {
            delay: baseOffset + 630 + (LETTER_DELAYS[i] ?? 0),
            duration: 450,
            easing: COUT,
          },
        );
      });

      runAnim(
        playSvgRef.current,
        [{ opacity: 0 }, { opacity: 1 }],
        { delay: baseOffset + 970, duration: 230, easing: 'linear' },
      );

      const capDelays = [730, 870, 970, 1000];
      captionRowRefs.current.forEach((el, i) => {
        runAnim(
          el,
          [{ transform: 'translateY(100%)' }, { transform: 'none' }],
          { delay: baseOffset + (capDelays[i] ?? 1000), duration: 220, easing: COUT },
        );
      });
    };

    // ------------------------------------------------------------------
    // 5. Scroll Transition State Machine
    // ------------------------------------------------------------------
    const goTo = (target: 0 | 1) => {
      if (locked || target === currentState) return;
      currentState = target;

      if (prefersReduced) {
        if (target === 1) stage.classList.add('is-s2');
        else stage.classList.remove('is-s2');
        return;
      }

      locked = true;
      commitAndCancelAll();

      if (target === 1) {
        // Compute drop distance D from word top to bottom of foreground box + 8px
        const fgRect = fgRef.current?.getBoundingClientRect();
        const wordRect = wordRef.current?.getBoundingClientRect();
        const D = fgRect && wordRect ? Math.max(240, fgRect.bottom - wordRect.top + 8) : 380;

        runAnim(
          h1TitleSpanRef.current,
          [{ transform: 'none' }, { transform: 'translateY(-100%)' }],
          { delay: 0, duration: 280, easing: CIN },
        );
        runAnim(
          h1BodySpanRef.current,
          [{ transform: 'none' }, { transform: 'translateY(100%)' }],
          { delay: 50, duration: 250, easing: CIN },
        );
        captionRowRefs.current.forEach((el, i) => {
          runAnim(
            el,
            [{ transform: 'none' }, { transform: 'translateY(100%)' }],
            { delay: i * 20, duration: 260, easing: CIN },
          );
        });
        runAnim(
          videoCardRef.current,
          [{ opacity: 1 }, { opacity: 0 }],
          { delay: 350, duration: 130, easing: 'linear' },
        );
        letterRefs.current.forEach((el, i) => {
          runAnim(
            el,
            [{ transform: 'none' }, { transform: `translateY(${D}px)` }],
            { delay: i * 55, duration: 450, easing: CIN },
          );
        });
        runAnim(
          moundLRef.current,
          [{ transform: 'none' }, { transform: 'translateX(-51%)' }],
          { delay: 20, duration: 560, easing: CIN },
        );
        runAnim(
          moundRRef.current,
          [{ transform: 'none' }, { transform: 'translateX(51%)' }],
          { delay: 150, duration: 450, easing: CIN },
        );

        // Section 2 in with 55-keyframe exponential-settle curve
        const kfIn = buildSection2Keyframes(false);
        const s2Items: Array<{ el: Element | null; lag: number }> = [
          { el: s2TitleRef.current, lag: 0 },
          { el: s2BodyRef.current, lag: 100 },
          { el: s2ArrowRef.current, lag: 100 },
          { el: s2CardRefs.current[0] ?? null, lag: 0 },
          { el: s2CardRefs.current[1] ?? null, lag: 150 },
          { el: s2CardRefs.current[2] ?? null, lag: 300 },
        ];
        s2Items.forEach(({ el, lag }) => {
          runAnim(el, kfIn, { delay: 180 + lag, duration: 1800, easing: 'linear' });
        });

        runCamera(true, 550, 1700);

        pushTimer(() => {
          stage.classList.add('is-s2');
          locked = false;
        }, 2300);
      } else {
        // Section 2 back to Hero
        stage.classList.remove('is-s2');
        const kfOut = buildSection2Keyframes(true);
        const s2ItemsRev: Array<{ el: Element | null; lag: number }> = [
          { el: s2TitleRef.current, lag: 100 },
          { el: s2BodyRef.current, lag: 0 },
          { el: s2ArrowRef.current, lag: 0 },
          { el: s2CardRefs.current[0] ?? null, lag: 300 },
          { el: s2CardRefs.current[1] ?? null, lag: 150 },
          { el: s2CardRefs.current[2] ?? null, lag: 0 },
        ];
        s2ItemsRev.forEach(({ el, lag }) => {
          runAnim(el, kfOut, { delay: lag, duration: 1800, easing: 'linear' });
        });

        runCamera(false, 200, 1700);
        playHeroEntrance(800, true);

        pushTimer(() => {
          locked = false;
        }, 2300);
      }
    };

    goToRef.current = goTo;

    // ------------------------------------------------------------------
    // 6. Start Intro (or reduced motion immediate mount)
    // ------------------------------------------------------------------
    let started = false;
    const startIntro = () => {
      if (started || disposed) return;
      started = true;
      stage.classList.remove('pre');
      if (prefersReduced) {
        stage.classList.add('rm');
        locked = false;
        return;
      }
      playHeroEntrance(0, false);
      pushTimer(() => {
        locked = false;
      }, 1450);
    };

    if (prefersReduced) {
      startIntro();
    } else {
      const fontsReady =
        typeof document !== 'undefined' && document.fonts?.ready
          ? document.fonts.ready.catch(() => {})
          : Promise.resolve();

      Promise.all([fontsReady, prepareHeroPlate(), prepareMounds()]).then(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(startIntro);
        });
      });
      pushTimer(startIntro, 2500);
    }

    // ------------------------------------------------------------------
    // 7. Wheel, Touch, Keyboard Handlers
    // ------------------------------------------------------------------
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (Math.abs(e.deltaY) <= 4) return;
      if (e.deltaY > 0) goTo(1);
      else goTo(0);
    };

    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) touchStartY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (e.changedTouches.length === 0) return;
      const dy = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(dy) <= 30) return;
      if (dy > 0) goTo(1);
      else goTo(0);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        goTo(1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        goTo(0);
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('keydown', onKeyDown);

    return () => {
      disposed = true;
      window.clearTimeout(cacheTimerId);
      commitAndCancelAll();
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('keydown', onKeyDown);
      for (const bmp of Array.from(bitmapCache.values())) bmp.close();
      bitmapCache.clear();
      if (moundCleanUrl) URL.revokeObjectURL(moundCleanUrl);
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        @font-face {
          font-family: 'Archivo Wide';
          src: url('https://fonts.gstatic.com/s/archivo/v25/k3kQo8UDI-1M0wlSfdnoLg.woff2') format('woff2');
          font-weight: 300 600;
          font-stretch: 62% 125%;
          font-display: swap;
        }
        @font-face {
          font-family: 'Onest';
          src: url('https://fonts.gstatic.com/s/onest/v11/gNMKW3F-SZuj7xmf-HY.woff2') format('woff2');
          font-weight: 400 500;
          font-display: swap;
        }

        :root {
          --deep: #121110;
          --dark: #1F1815;
          --accent: #5D3827;
          --soft: #C5794B;
          --light: #EDE3DA;
          --u: min(calc(100vw / 1440), calc(100vh / 810));
          --s: calc(100vw / 1440);
          --mb: 0px;
          --ease-out: cubic-bezier(.16, 1, .3, 1);
        }

        html.gw-stage-lock,
        html.gw-stage-lock body {
          height: 100%;
          overflow: hidden;
          background: var(--deep);
          color: var(--light);
          overscroll-behavior: none;
          margin: 0;
          padding: 0;
          font-family: 'Onest', system-ui, -apple-system, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .stage *,
        .stage *::before,
        .stage *::after {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .stage a {
          color: inherit;
          text-decoration: none;
        }

        .stage {
          position: fixed;
          inset: 0;
          overflow: hidden;
          background: var(--deep);
          color: var(--light);
          font-family: 'Onest', system-ui, -apple-system, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .plate,
        .cam {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          transform-origin: center;
        }

        .plate-s2 {
          opacity: 0;
        }

        .cam {
          opacity: 0;
          pointer-events: none;
        }

        .stage.cam-on .cam {
          opacity: 1;
        }

        .stage.is-s2 .plate-s2 {
          opacity: 1;
        }

        .shade {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(
            to bottom,
            rgba(18, 17, 16, .72) 0%,
            rgba(18, 17, 16, .18) 22%,
            rgba(18, 17, 16, 0) 40%,
            rgba(18, 17, 16, 0) 75%,
            rgba(18, 17, 16, .35) 100%
          );
        }

        .fg {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: calc(810 * var(--s));
          overflow: hidden;
          pointer-events: none;
        }

        .word {
          position: absolute;
          left: calc(-20 * var(--s));
          top: calc(495 * var(--s));
          font-family: 'Archivo Wide', sans-serif;
          font-stretch: 125%;
          font-weight: 600;
          font-size: calc(256 * var(--s));
          line-height: 1;
          letter-spacing: -.035em;
          color: var(--light);
          white-space: nowrap;
        }

        .word > span {
          display: inline-block;
          transform: scaleX(1.05);
          transform-origin: top left;
        }

        .word i {
          display: inline-block;
          font-style: normal;
        }

        .mounds {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: calc(810 * var(--s) * 0.64 + var(--mb));
          object-fit: fill;
          pointer-events: none;
        }

        .mound-l {
          clip-path: inset(0 50% 0 0);
        }

        .mound-r {
          clip-path: inset(0 0 0 50%);
        }

        .gw-nav {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          z-index: 5;
          height: calc(86 * var(--u));
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 calc(30 * var(--u)) 0 calc(26 * var(--u));
        }

        .gw-logo {
          display: inline-flex;
          align-items: center;
          cursor: pointer;
        }

        .gw-logo svg {
          width: max(40px, calc(52 * var(--u)));
          height: auto;
          display: block;
        }

        .gw-links {
          position: absolute;
          left: calc(436 * var(--u));
          top: 50%;
          transform: translateY(-50%);
          list-style: none;
          display: flex;
          gap: calc(64 * var(--u));
        }

        .gw-links li {
          overflow: hidden;
        }

        .gw-links a {
          display: inline-block;
          padding: 6px 0;
          line-height: 14px;
          font-size: max(11px, calc(12.5 * var(--u)));
          font-weight: 500;
          letter-spacing: .02em;
          text-transform: uppercase;
          opacity: .92;
          transition: opacity .3s ease;
          cursor: pointer;
        }

        .gw-links a:hover {
          opacity: .6;
        }

        .gw-menu {
          width: max(28px, calc(32 * var(--u)));
          height: max(28px, calc(24 * var(--u)));
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: max(6px, calc(9 * var(--u)));
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }

        .gw-menu span {
          display: block;
          width: 100%;
          height: 1.5px;
          background: var(--light);
        }

        .glyphs {
          position: absolute;
          left: calc(32 * var(--u));
          top: calc(211 * var(--u));
          z-index: 4;
          display: flex;
          flex-direction: column;
          gap: calc(13.8 * var(--u));
          color: rgba(237, 227, 218, .8);
        }

        .glyphs svg {
          width: max(11px, calc(17 * var(--u)));
          height: auto;
          display: block;
        }

        .h1 {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 3;
        }

        .h1 h1 {
          position: absolute;
          left: calc(38 * var(--u));
          top: calc(93 * var(--u));
          overflow: hidden;
          padding-bottom: .08em;
          font-family: 'Archivo Wide', sans-serif;
          font-stretch: 100%;
          font-weight: 400;
          font-size: calc(48.4 * var(--u));
          line-height: 1.2;
          letter-spacing: -.012em;
          word-spacing: .12em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .h1 h1 span,
        .h1 p span {
          display: block;
        }

        .h1 p {
          position: absolute;
          left: calc(1210 * var(--u));
          top: calc(99 * var(--u));
          width: calc(194 * var(--u));
          overflow: hidden;
          font-size: max(11px, calc(12.6 * var(--u)));
          line-height: 1.36;
          color: rgba(237, 227, 218, .86);
        }

        .vcard {
          position: absolute;
          left: calc(92 * var(--u));
          top: calc(206 * var(--u));
          width: calc(164 * var(--u));
          height: calc(114 * var(--u));
          border: 1px solid rgba(237, 227, 218, .18);
          background-color: var(--dark);
          background-image: url('${ASSETS.cards}');
          background-size: 200% 200%;
          background-position: 100% 100%;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: auto;
          cursor: pointer;
        }

        .vcard::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(18, 17, 16, .18);
        }

        .vcard svg {
          position: relative;
          z-index: 1;
          width: max(16px, calc(26 * var(--u)));
          height: auto;
        }

        .captions {
          position: absolute;
          left: 0;
          right: 0;
          bottom: calc(14 * var(--u));
          height: calc(40 * var(--u));
        }

        .cap {
          position: absolute;
          bottom: 0;
          overflow: hidden;
        }

        .cap-1 { left: calc(37 * var(--u)); }
        .cap-2 { left: calc(411 * var(--u)); }
        .cap-3 { left: calc(786 * var(--u)); }
        .cap-4 { left: calc(1173 * var(--u)); }

        .mi {
          display: flex;
          align-items: center;
          gap: calc(14 * var(--u));
        }

        .mi-num {
          font-family: 'Archivo Wide', sans-serif;
          font-stretch: 104%;
          font-weight: 300;
          font-size: calc(33.3 * var(--u));
          line-height: 1;
        }

        .mi-txt {
          border-left: 1px solid rgba(237, 227, 218, .4);
          padding-left: calc(12 * var(--u));
          font-size: max(11px, calc(11.6 * var(--u)));
          line-height: 1.3;
          color: rgba(237, 227, 218, .82);
        }

        .s2 {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 4;
        }

        .s2 h2,
        .s2 > p,
        .s2-arrow,
        .s2-card {
          opacity: 0;
        }

        .stage.is-s2 .s2 h2,
        .stage.is-s2 .s2 > p,
        .stage.is-s2 .s2-arrow,
        .stage.is-s2 .s2-card {
          opacity: 1;
          pointer-events: auto;
        }

        .stage.is-s2 .h1 {
          opacity: 0;
          pointer-events: none;
        }

        .s2 h2 {
          position: absolute;
          left: calc(74 * var(--u));
          top: calc(124 * var(--u));
          font-family: 'Archivo Wide', sans-serif;
          font-stretch: 90%;
          font-weight: 400;
          font-size: calc(37.7 * var(--u));
          line-height: calc(43 * var(--u));
          text-transform: uppercase;
        }

        .s2 > p {
          position: absolute;
          left: calc(74 * var(--u));
          top: calc(289 * var(--u));
          width: calc(246 * var(--u));
          font-size: max(11px, calc(14.2 * var(--u)));
          line-height: 1.5;
          color: rgba(237, 227, 218, .86);
        }

        .s2-arrow {
          position: absolute;
          left: calc(73 * var(--u));
          top: calc(472 * var(--u));
          display: inline-flex;
          pointer-events: auto;
        }

        .s2-arrow svg {
          width: max(24px, calc(26 * var(--u)));
          height: auto;
        }

        .s2-cards {
          position: absolute;
          left: calc(704 * var(--u));
          top: calc(480 * var(--u));
          display: flex;
          gap: calc(19 * var(--u));
        }

        .s2-card {
          position: relative;
          width: calc(216 * var(--u));
          height: calc(246 * var(--u));
          background: var(--dark);
          border: 1px solid rgba(237, 227, 218, .12);
          overflow: hidden;
          pointer-events: auto;
          display: block;
        }

        .s2-card-img {
          position: absolute;
          inset: 0;
          background-image: url('${ASSETS.cards}');
          background-size: 200% 200%;
          transition: transform .9s var(--ease-out);
        }

        .s2-card:hover .s2-card-img {
          transform: scale(1.05);
        }

        .s2-card-1 .s2-card-img { background-position: 0 0; }
        .s2-card-2 .s2-card-img { background-position: 100% 0; }
        .s2-card-3 .s2-card-img { background-position: 0 100%; }

        .s2-card-shade {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(18, 17, 16, 0) 55%,
            rgba(18, 17, 16, .55) 100%
          );
          pointer-events: none;
        }

        .s2-card-lbl {
          position: absolute;
          left: calc(16 * var(--u));
          bottom: calc(14 * var(--u));
          font-size: max(11px, calc(16.5 * var(--u)));
          font-weight: 500;
          letter-spacing: .02em;
          text-transform: uppercase;
        }

        /* Initial Pre State */
        .stage.pre .plate-h1 {
          transform: scale(1.3);
        }

        .stage.pre .gw-links,
        .stage.pre .gw-menu,
        .stage.pre .glyphs,
        .stage.pre .fg,
        .stage.pre .h1 {
          opacity: 0;
        }

        /* Reduced motion */
        .stage.rm .plate-h1 { transform: none !important; }
        .stage.rm .s2-card-img { transition: none !important; }
        .stage.rm.is-s2 .fg { opacity: 0; pointer-events: none; }

        /* ----------------------------------------------------------------
           RESPONSIVE: PHONES (<= 820px or portrait <= 1/1 aspect)
           ---------------------------------------------------------------- */
        @media (max-width: 820px), (max-aspect-ratio: 1/1) {
          :root {
            --u: calc(100vw / 390);
            --mb: 96px;
          }

          .shade {
            background: linear-gradient(
              to bottom,
              rgba(18, 17, 16, .9) 0%,
              rgba(18, 17, 16, .62) 30%,
              rgba(18, 17, 16, .25) 48%,
              rgba(18, 17, 16, 0) 60%,
              rgba(18, 17, 16, .45) 100%
            );
          }

          .gw-nav {
            height: auto;
            padding: 16px 18px 0;
            flex-wrap: wrap;
            gap: 8px;
          }

          .gw-logo svg {
            width: 42px;
          }

          .gw-links {
            position: static;
            transform: none;
            order: 3;
            width: 100%;
            justify-content: space-between;
            gap: 6px;
            margin-top: 2px;
            flex-wrap: nowrap;
          }

          .gw-links a {
            font-size: 11px;
            white-space: nowrap;
            letter-spacing: 0.01em;
          }

          .gw-menu {
            width: 30px;
            height: 28px;
            gap: 7px;
          }

          .glyphs {
            left: 18px;
            top: 94px;
            flex-direction: row;
            gap: 12px;
          }

          .glyphs svg {
            width: 13px;
          }

          .h1 h1 {
            left: 18px;
            right: 18px;
            top: 118px;
            font-size: min(26px, 6.4vw);
            line-height: 1.2;
            white-space: normal;
          }

          .h1 p {
            left: 18px;
            top: calc(118px + 3 * 1.2 * min(26px, 6.4vw) + 14px);
            width: min(300px, 60vw);
            font-size: 12.5px;
          }

          .vcard {
            left: auto;
            right: 18px;
            top: calc(118px + 3 * 1.2 * min(26px, 6.4vw) + 14px);
            width: min(120px, 26vw);
            height: min(84px, 18vw);
          }

          .fg {
            height: calc(100vw * 810 / 1440 + 192px);
          }

          .captions {
            left: 18px;
            right: 18px;
            bottom: 16px;
            height: auto;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }

          .cap {
            position: static;
          }

          .mi {
            gap: 10px;
          }

          .mi-num {
            font-size: 22px;
          }

          .mi-txt {
            font-size: 11px;
            padding-left: 8px;
          }

          .s2 h2 {
            left: 18px;
            top: 118px;
            font-size: min(24px, 6vw);
            line-height: 1.28;
          }

          .s2 > p {
            left: 18px;
            top: calc(118px + 3 * 1.28 * min(24px, 6vw) + 18px);
            width: min(330px, calc(100vw - 36px));
            font-size: 12.5px;
          }

          .s2-cards {
            left: 18px;
            right: 18px;
            top: auto;
            bottom: 20px;
            gap: 8px;
          }

          .s2-card {
            width: calc((100vw - 52px) / 3);
            height: auto;
            aspect-ratio: 216 / 246;
          }

          .s2-card-lbl {
            left: 10px;
            bottom: 10px;
            font-size: 11px;
          }

          .s2-arrow {
            left: 18px;
            top: auto;
            bottom: calc(20px + ((100vw - 52px) / 3) * (246 / 216) + 16px);
          }
        }

        /* ----------------------------------------------------------------
           RESPONSIVE: TABLETS IN PORTRAIT (width >= 600px & portrait)
           ---------------------------------------------------------------- */
        @media (min-width: 600px) and (max-aspect-ratio: 1/1) {
          :root {
            --u: calc(100vw / 760);
            --mb: 76px;
          }

          .gw-links {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            order: initial;
            width: auto;
            gap: 36px;
            margin-top: 0;
          }

          .gw-links a {
            font-size: 12px;
          }

          .h1 h1 {
            top: 130px;
            font-size: min(40px, 5.4vw);
          }

          .h1 p {
            top: calc(130px + 3 * 1.2 * min(40px, 5.4vw) + 18px);
            width: 300px;
            font-size: 14px;
          }

          .vcard {
            top: calc(130px + 3 * 1.2 * min(40px, 5.4vw) + 18px);
            width: 200px;
            height: 140px;
          }

          .captions {
            grid-template-columns: repeat(4, 1fr);
          }

          .fg {
            height: calc(100vw * 810 / 1440 + 152px);
          }

          .s2 h2 {
            font-size: min(34px, 4.6vw);
          }

          .s2-card {
            width: calc((100vw - 92px) / 3);
          }

          .s2-cards {
            gap: 14px;
          }
        }

        /* ----------------------------------------------------------------
           RESPONSIVE: SHORT LANDSCAPE PHONES (max-height: 520px & landscape)
           ---------------------------------------------------------------- */
        @media (max-height: 520px) and (min-aspect-ratio: 1/1) {
          :root {
            --u: calc(100vh / 470);
            --mb: 36px;
          }

          .gw-links {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: auto;
            gap: 22px;
            margin-top: 0;
          }

          .h1 h1 {
            left: 18px;
            top: 64px;
            width: 58vw;
            white-space: normal;
            font-size: clamp(15px, 2.6vw, 22px);
          }

          .h1 p {
            left: auto;
            right: 18px;
            top: 64px;
            width: 210px;
            font-size: 11px;
          }

          .vcard,
          .glyphs,
          .s2-arrow {
            display: none !important;
          }

          .captions {
            bottom: 8px;
            grid-template-columns: repeat(4, 1fr);
          }

          .fg {
            height: calc(100vw * 810 / 1440 + 36px);
          }

          .s2-cards {
            left: auto;
            right: 18px;
            bottom: 14px;
          }

          .s2-card {
            width: min(150px, 15vw);
          }
        }
      `}</style>

      <main ref={stageRef} className="stage pre" aria-label="GATEWISE AI Gate Security Portal">
        {/* Layer 1: Hero Plate */}
        <img
          ref={h1PlateRef}
          className="plate plate-h1"
          src={ASSETS.heroPlate}
          alt="Illuminated campus iron gate in stone courtyard"
          fetchPriority="high"
          decoding="async"
        />

        {/* Layer 2: Section 2 Plate */}
        <img
          ref={s2PlateRef}
          className="plate plate-s2"
          src={ASSETS.s2Plate}
          alt="Three-quarter perspective of security courtyard"
          decoding="async"
        />

        {/* Layer 3: Camera Frame Cache Canvas */}
        <canvas ref={camCanvasRef} className="cam" width={1280} height={720} />

        {/* Layer 4: Shade Gradient */}
        <div className="shade" />

        {/* Layer 5: Foreground Box (Big Word behind Two Clipped Rock Mounds) */}
        <div ref={fgRef} className="fg">
          <div ref={wordRef} className="word" aria-hidden="true">
            <span>
              {WORD_LETTERS.map((ch, idx) => (
                <i
                  key={idx}
                  ref={(el) => {
                    letterRefs.current[idx] = el;
                  }}
                >
                  {ch}
                </i>
              ))}
            </span>
          </div>
          <img
            ref={moundLRef}
            className="mounds mound-l"
            src={ASSETS.mounds}
            crossOrigin="anonymous"
            alt=""
          />
          <img
            ref={moundRRef}
            className="mounds mound-r"
            src={ASSETS.mounds}
            crossOrigin="anonymous"
            alt=""
          />
        </div>

        {/* Layer 6: Top Navigation Header */}
        <header className="gw-nav">
          <button
            type="button"
            onClick={() => goToRef.current(0)}
            className="gw-logo bg-transparent border-0"
            aria-label="GATEWISE AI home"
          >
            <svg viewBox="0 0 56 56" fill="none" stroke="var(--light)">
              <circle cx="28" cy="28" r="26" strokeWidth="1.6" />
              <circle cx="28" cy="28" r="21" strokeWidth=".8" strokeDasharray="1.5 3" />
              {/* Gate / Torch Emblem inside circle */}
              <path
                d="M28 13C29.8 17.5 33.4 20.6 33.4 25.4C33.4 29.2 31 32 28 32C25 32 22.6 29.2 22.6 25.4C22.6 20.6 26.2 17.5 28 13Z"
                fill="var(--light)"
                stroke="none"
              />
              <circle cx="28" cy="25.5" r="2.2" fill="var(--deep)" stroke="none" />
              <line x1="17" y1="41" x2="39" y2="41" strokeWidth="1.6" strokeLinecap="round" />
              <line x1="20" y1="45" x2="36" y2="45" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>

          <ul className="gw-links">
            {[
              { label: 'Admin', href: '/admin/login' },
              { label: 'Guard', href: '/guard' },
              { label: 'System', href: '/how-it-works' },
              { label: 'Security', href: '/security' },
              { label: 'Command', href: '#command', action: () => goToRef.current(1) },
            ].map((item, i) => (
              <li key={item.label}>
                {item.action ? (
                  <a
                    ref={(el) => {
                      navLinkRefs.current[i] = el;
                    }}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      item.action?.();
                    }}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    ref={(el) => {
                      navLinkRefs.current[i] = el;
                    }}
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          <button
            ref={menuBtnRef}
            type="button"
            className="gw-menu"
            aria-label="Menu"
            onClick={() => setMenuOpen(true)}
          >
            <span />
            <span />
          </button>
        </header>

        {/* Layer 7: Seven Security Glyph Icons Column */}
        <div ref={glyphsRef} className="glyphs" aria-hidden="true">
          {/* 1. Dagger cross */}
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
            <line x1="8" y1="1.5" x2="8" y2="14.5" />
            <line x1="4" y1="5" x2="12" y2="5" />
          </svg>
          {/* 2. Diamond outline */}
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
            <polygon points="8,2 14,8 8,14 2,8" />
          </svg>
          {/* 3. Plus */}
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
            <line x1="8" y1="2.5" x2="8" y2="13.5" />
            <line x1="2.5" y1="8" x2="13.5" y2="8" />
          </svg>
          {/* 4. Four dots around center dot */}
          <svg viewBox="0 0 16 16" fill="currentColor" stroke="none">
            <circle cx="8" cy="8" r="1.4" />
            <circle cx="8" cy="3" r="1.1" />
            <circle cx="8" cy="13" r="1.1" />
            <circle cx="3" cy="8" r="1.1" />
            <circle cx="13" cy="8" r="1.1" />
          </svg>
          {/* 5. Eight-spoke asterisk */}
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2">
            <line x1="8" y1="2" x2="8" y2="14" />
            <line x1="2" y1="8" x2="14" y2="8" />
            <line x1="3.8" y1="3.8" x2="12.2" y2="12.2" />
            <line x1="12.2" y1="3.8" x2="3.8" y2="12.2" />
          </svg>
          {/* 6. Filled four-point star */}
          <svg viewBox="0 0 16 16" fill="currentColor" stroke="none">
            <path d="M8 1.5 L9.8 6.2 L14.5 8 L9.8 9.8 L8 14.5 L6.2 9.8 L1.5 8 L6.2 6.2 Z" />
          </svg>
          {/* 7. Triangle with bar inside */}
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
            <polygon points="8,2.5 14,13.5 2,13.5" />
            <line x1="5.5" y1="10" x2="10.5" y2="10" />
          </svg>
        </div>

        {/* Layer 8: Hero Section */}
        <section className="h1" aria-label="Introduction">
          <h1>
            <span ref={h1TitleSpanRef}>Verifying identity at every campus gate.</span>
          </h1>

          <p>
            <span ref={h1BodySpanRef}>
              A precise security craft, where biometrics and guard oversight shape trusted campus access.
            </span>
          </p>

          <a
            ref={videoCardRef}
            href="#preview-film"
            className="vcard"
            aria-label="Play film"
            onClick={(e) => {
              e.preventDefault();
              setFilmOpen(true);
            }}
          >
            <svg ref={playSvgRef} id="play" viewBox="0 0 24 24" fill="none" stroke="#EDE3DA" strokeWidth="1.4">
              <polygon points="7,4 19,12 7,20" />
            </svg>
          </a>

          <div className="captions">
            {[
              { cls: 'cap-1', num: '01', l1: 'Face & plate scans,', l2: 'unified in real time.' },
              { cls: 'cap-2', num: '02', l1: 'Guard authority,', l2: 'admin governed.' },
              { cls: 'cap-3', num: '03', l1: 'Central database,', l2: 'instant gate sync.' },
              { cls: 'cap-4', num: '04', l1: 'IIM Sambalpur,', l2: 'perimeter secured.' },
            ].map((cap, idx) => (
              <div key={cap.num} className={`cap ${cap.cls}`}>
                <div
                  ref={(el) => {
                    captionRowRefs.current[idx] = el;
                  }}
                  className="mi"
                >
                  <span className="mi-num">{cap.num}</span>
                  <span className="mi-txt">
                    {cap.l1}
                    <br />
                    {cap.l2}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Layer 9: Section 2 */}
        <section className="s2" aria-label="System Command Overview">
          <h2 ref={s2TitleRef}>
            Sovereign
            <br />
            access control
            <br />
            at the gate.
          </h2>

          <p ref={s2BodyRef}>
            Step into the heart of Gatewise AI, where central PostgreSQL records and handheld guard terminals work together. Here, biometric verification meets strict RBAC governance, and every gate event records cryptographic proof for institutional oversight.
          </p>

          <Link
            ref={s2ArrowRef}
            href="/admin/login"
            className="s2-arrow"
            aria-label="Open Admin Command Portal"
          >
            <svg viewBox="0 0 26 26" fill="none" stroke="var(--light)" strokeWidth="1.5">
              <line x1="3" y1="23" x2="23" y2="3" />
              <polyline points="8,3 23,3 23,18" />
            </svg>
          </Link>

          <div className="s2-cards">
            <Link
              ref={(el) => {
                s2CardRefs.current[0] = el;
              }}
              href="/admin/login"
              className="s2-card s2-card-1"
            >
              <div className="s2-card-img" />
              <div className="s2-card-shade" />
              <span className="s2-card-lbl">Admin Portal</span>
            </Link>

            <Link
              ref={(el) => {
                s2CardRefs.current[1] = el;
              }}
              href="/guard"
              className="s2-card s2-card-2"
            >
              <div className="s2-card-img" />
              <div className="s2-card-shade" />
              <span className="s2-card-lbl">Guard App</span>
            </Link>

            <Link
              ref={(el) => {
                s2CardRefs.current[2] = el;
              }}
              href="/how-it-works"
              className="s2-card s2-card-3"
            >
              <div className="s2-card-img" />
              <div className="s2-card-shade" />
              <span className="s2-card-lbl">Architecture</span>
            </Link>
          </div>
        </section>

        {/* Fullscreen Command Menu Overlay */}
        {menuOpen && (
          <div
            className="fixed inset-0 z-50 flex flex-col justify-between p-8 md:p-14"
            style={{ background: 'rgba(18, 17, 16, 0.96)', backdropFilter: 'blur(16px)' }}
          >
            <div className="flex items-center justify-between">
              <span
                className="text-xs tracking-[0.22em] uppercase"
                style={{ color: 'rgba(237,227,218,0.65)', fontFamily: "'Archivo Wide', sans-serif" }}
              >
                GATEWISE AI · IIM SAMBALPUR PERIMETER
              </span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="px-3 py-1.5 text-xs uppercase tracking-[0.18em] border cursor-pointer"
                style={{ borderColor: 'rgba(237,227,218,0.28)', color: 'var(--light)', background: 'transparent' }}
              >
                Close
              </button>
            </div>

            <nav className="grid gap-4 md:gap-6 max-w-2xl">
              {[
                { num: '01', title: 'Admin Command Portal', sub: 'Central People Database, Approvals, Guard Permissions & Live Gate Feed', href: '/admin/login' },
                { num: '02', title: 'Guard Mobile Terminal', sub: 'Smartphone-Only Face & ANPR Scanner with Real-Time Verification', href: '/guard' },
                { num: '03', title: 'System Architecture', sub: 'Centralized PostgreSQL, Biometrics & Edge Verification Pipeline', href: '/how-it-works' },
                { num: '04', title: 'Security & RBAC', sub: 'Role Isolation, Private Photo Buckets & Audit Trail', href: '/security' },
              ].map((row) => (
                <Link
                  key={row.num}
                  href={row.href}
                  onClick={() => setMenuOpen(false)}
                  className="group flex items-baseline gap-5 py-3 border-b transition-colors"
                  style={{ borderColor: 'rgba(237,227,218,0.12)' }}
                >
                  <span
                    className="text-sm opacity-50 group-hover:opacity-100"
                    style={{ fontFamily: "'Archivo Wide', sans-serif", color: 'var(--soft)' }}
                  >
                    {row.num}
                  </span>
                  <div>
                    <div
                      className="text-2xl md:text-3xl uppercase tracking-tight group-hover:opacity-75 transition-opacity"
                      style={{ fontFamily: "'Archivo Wide', sans-serif" }}
                    >
                      {row.title}
                    </div>
                    <div className="text-xs mt-1" style={{ color: 'rgba(237,227,218,0.62)' }}>
                      {row.sub}
                    </div>
                  </div>
                </Link>
              ))}
            </nav>

            <div className="flex flex-wrap items-center justify-between gap-4 text-xs" style={{ color: 'rgba(237,227,218,0.55)' }}>
              <span>Scroll / Swipe or press ArrowDown to transition Courtyard View</span>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  goToRef.current(1);
                }}
                className="underline uppercase tracking-widest cursor-pointer bg-transparent border-0"
                style={{ color: 'var(--soft)' }}
              >
                Explore Courtyard Overview
              </button>
            </div>
          </div>
        )}

        {/* Video Reel Modal (triggered by Play Film card) */}
        {filmOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10"
            style={{ background: 'rgba(18, 17, 16, 0.94)', backdropFilter: 'blur(12px)' }}
            onClick={() => setFilmOpen(false)}
          >
            <div
              className="relative w-full max-w-4xl border"
              style={{ background: 'var(--dark)', borderColor: 'rgba(237,227,218,0.2)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="flex items-center justify-between px-4 py-3 border-b text-xs uppercase tracking-[0.16em]"
                style={{ borderColor: 'rgba(237,227,218,0.12)' }}
              >
                <span>GATEWISE AI — Courtyard Perimeter Reel</span>
                <button
                  type="button"
                  onClick={() => setFilmOpen(false)}
                  className="px-2.5 py-1 border cursor-pointer bg-transparent"
                  style={{ borderColor: 'rgba(237,227,218,0.28)', color: 'var(--light)' }}
                >
                  Close
                </button>
              </div>
              <video
                src={ASSETS.video}
                controls
                autoPlay
                playsInline
                className="w-full aspect-video bg-black"
              />
              <div
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-xs"
                style={{ borderTop: '1px solid rgba(237,227,218,0.12)', color: 'rgba(237,227,218,0.78)' }}
              >
                <span>Launch operational portals directly:</span>
                <div className="flex items-center gap-3">
                  <Link
                    href="/admin/login"
                    className="px-3 py-1.5 border uppercase tracking-wider"
                    style={{ borderColor: 'var(--soft)', color: 'var(--light)' }}
                  >
                    Admin Portal
                  </Link>
                  <Link
                    href="/guard"
                    className="px-3 py-1.5 uppercase tracking-wider"
                    style={{ background: 'var(--soft)', color: 'var(--deep)', fontWeight: 600 }}
                  >
                    Guard Mobile App
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
