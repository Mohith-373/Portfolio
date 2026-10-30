"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Eraser, Pencil, Sparkles } from "lucide-react";
import { classify, parseModel, toMnist, type DigitModel } from "@/lib/digitModel";
import { withBase } from "@/lib/paths";
import { GameHeader, type GameTab } from "./GameTabs";

// "Draw a digit": visitors draw 0-9 and a small convolutional neural network,
// running in the browser, guesses it live. Two tabs: Play, and How it works.

const INK_SIZE = 280; // resolution of the hidden drawing the model reads
const TRAINING_CODE = "https://github.com/Mohith-373/Portfolio/blob/main/scripts/train_digits.py";

type Stroke = { x: number; y: number }[];

export function HeroDigitGame() {
  const baseId = useId();
  const [tab, setTab] = useState<GameTab>("play");
  const [model, setModel] = useState<DigitModel | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [probs, setProbs] = useState<number[] | null>(null);
  const [hasInk, setHasInk] = useState(false);
  const [touch, setTouch] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLCanvasElement>(null);
  const strokes = useRef<Stroke[]>([]);
  const example = useRef<Uint8Array | null>(null);
  const drawing = useRef(false);
  const pending = useRef(false);
  const modelRef = useRef<DigitModel | null>(null);
  const exampleIndex = useRef(0);

  // Load the trained weights once the page has settled.
  useEffect(() => {
    setTouch(window.matchMedia("(hover: none)").matches);
    let cancelled = false;
    fetch(withBase("/models/digits.json"))
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      })
      .then((raw) => {
        if (cancelled) return;
        const parsed = parseModel(raw);
        modelRef.current = parsed;
        setModel(parsed);
        exampleIndex.current = Math.floor(Math.random() * 10);
      })
      .catch(() => !cancelled && setLoadError(true));
    return () => {
      cancelled = true;
    };
  }, []);

  // Render the visible canvas (theme colours) from strokes or the example image.
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (canvas.width !== Math.round(rect.width * dpr)) {
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
    }
    const w = canvas.width;
    const ink = getComputedStyle(document.documentElement).getPropertyValue("--fg").trim() || "#12161c";
    ctx.clearRect(0, 0, w, w);

    if (example.current) {
      const img = example.current;
      const tmp = document.createElement("canvas");
      tmp.width = 28;
      tmp.height = 28;
      const tctx = tmp.getContext("2d")!;
      const data = tctx.createImageData(28, 28);
      ctx.fillStyle = ink;
      for (let i = 0; i < 784; i++) {
        data.data[i * 4 + 3] = img[i];
      }
      tctx.putImageData(data, 0, 0);
      // Tint: draw the alpha mask, then fill with ink colour using source-in.
      const tinted = document.createElement("canvas");
      tinted.width = 28;
      tinted.height = 28;
      const ttx = tinted.getContext("2d")!;
      ttx.drawImage(tmp, 0, 0);
      ttx.globalCompositeOperation = "source-in";
      ttx.fillStyle = ink;
      ttx.fillRect(0, 0, 28, 28);
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(tinted, w * 0.1, w * 0.1, w * 0.8, w * 0.8);
      return;
    }

    ctx.strokeStyle = ink;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = w * 0.075;
    for (const s of strokes.current) {
      ctx.beginPath();
      s.forEach((pt, i) => (i === 0 ? ctx.moveTo(pt.x * w, pt.y * w) : ctx.lineTo(pt.x * w, pt.y * w)));
      if (s.length === 1) ctx.lineTo(s[0].x * w + 0.1, s[0].y * w);
      ctx.stroke();
    }
  }, []);

  // Draw "what the AI sees" (the 28x28 input) into the small preview.
  const renderPreview = useCallback((img: Float32Array | null) => {
    const canvas = previewRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const data = ctx.createImageData(28, 28);
    for (let i = 0; i < 784; i++) {
      const v = img ? Math.round(img[i] * 255) : 0;
      data.data[i * 4] = v;
      data.data[i * 4 + 1] = v;
      data.data[i * 4 + 2] = v;
      data.data[i * 4 + 3] = 255;
    }
    ctx.putImageData(data, 0, 0);
  }, []);

  // Build the model input from the strokes, then classify.
  const runModel = useCallback(() => {
    pending.current = false;
    let input: Float32Array | null = null;
    if (example.current) {
      input = Float32Array.from(example.current, (v) => v / 255);
    } else if (strokes.current.length > 0) {
      const off = document.createElement("canvas");
      off.width = INK_SIZE;
      off.height = INK_SIZE;
      const octx = off.getContext("2d")!;
      octx.fillStyle = "#000";
      octx.fillRect(0, 0, INK_SIZE, INK_SIZE);
      octx.strokeStyle = "#fff";
      octx.lineCap = "round";
      octx.lineJoin = "round";
      octx.lineWidth = INK_SIZE * 0.075;
      for (const s of strokes.current) {
        octx.beginPath();
        s.forEach((pt, i) => (i === 0 ? octx.moveTo(pt.x * INK_SIZE, pt.y * INK_SIZE) : octx.lineTo(pt.x * INK_SIZE, pt.y * INK_SIZE)));
        if (s.length === 1) octx.lineTo(s[0].x * INK_SIZE + 0.1, s[0].y * INK_SIZE);
        octx.stroke();
      }
      const px = octx.getImageData(0, 0, INK_SIZE, INK_SIZE).data;
      const ink = new Float32Array(INK_SIZE * INK_SIZE);
      for (let i = 0; i < ink.length; i++) ink[i] = px[i * 4] / 255;
      input = toMnist(ink, INK_SIZE);
    }
    renderPreview(input);
    const m = modelRef.current;
    setProbs(input && m ? classify(m, input) : null);
  }, [renderPreview]);

  const schedule = useCallback(() => {
    if (pending.current) return;
    pending.current = true;
    window.setTimeout(() => requestAnimationFrame(runModel), 90);
  }, [runModel]);

  // Re-run once the model finishes loading, in case someone drew first.
  useEffect(() => {
    if (model && (strokes.current.length > 0 || example.current)) runModel();
  }, [model, runModel]);

  // Canvas setup: pointer drawing, resize and theme changes.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    render();
    renderPreview(null);

    const pos = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)), y: Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)) };
    };
    const down = (e: PointerEvent) => {
      if (e.button > 0) return;
      e.preventDefault();
      canvas.setPointerCapture(e.pointerId);
      if (example.current) {
        example.current = null;
        strokes.current = [];
      }
      drawing.current = true;
      strokes.current.push([pos(e)]);
      setHasInk(true);
      render();
      schedule();
    };
    const move = (e: PointerEvent) => {
      if (!drawing.current) return;
      const s = strokes.current[strokes.current.length - 1];
      const p = pos(e);
      const last = s[s.length - 1];
      if (Math.hypot(p.x - last.x, p.y - last.y) < 0.004) return;
      s.push(p);
      render();
      schedule();
    };
    const up = () => {
      if (!drawing.current) return;
      drawing.current = false;
      runModel();
    };
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);

    const ro = new ResizeObserver(() => render());
    ro.observe(canvas);
    const mo = new MutationObserver(() => render());
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => {
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
      ro.disconnect();
      mo.disconnect();
    };
  }, [render, renderPreview, runModel, schedule]);

  function clear() {
    strokes.current = [];
    example.current = null;
    setHasInk(false);
    setProbs(null);
    render();
    renderPreview(null);
  }

  function showExample() {
    const m = modelRef.current;
    if (!m) return;
    strokes.current = [];
    example.current = m.examples[exampleIndex.current % 10];
    exampleIndex.current += 3; // step through digits in a mixed order
    setHasInk(true);
    render();
    runModel();
  }

  const best = probs ? probs.indexOf(Math.max(...probs)) : -1;
  const confidence = probs ? probs[best] : 0;

  const actionClass =
    "inline-flex items-center gap-1.5 rounded-md border border-line px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-surface-2 disabled:opacity-40 disabled:hover:bg-transparent";

  return (
    <div className="h-full rounded-2xl border border-line bg-surface p-4 sm:p-5" data-game="digits" data-guess={best} data-tab={tab}>
      <GameHeader baseId={baseId} title="Draw a digit" dotClass="bg-accent" tab={tab} onTab={setTab} />

      {/* Play */}
      <div role="tabpanel" id={`${baseId}-panel-play`} aria-labelledby={`${baseId}-tab-play`} hidden={tab !== "play"} className="mt-3">
        <div className="relative">
          <canvas
            ref={canvasRef}
            aria-label="Drawing area. Draw a single digit from 0 to 9."
            className="aspect-square w-full cursor-crosshair touch-none rounded-xl border border-dashed border-line-strong bg-bg"
          />
          {!hasInk ? (
            <p className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1 px-6 text-center text-muted">
              <Pencil className="size-5 text-subtle" aria-hidden="true" />
              <span className="font-medium text-fg">Draw any digit, 0 to 9</span>
              <span className="text-sm">{touch ? "Use your finger." : "Click and drag with your mouse."}</span>
            </p>
          ) : null}
          <figure className="absolute right-2 top-2 rounded-md border border-line bg-surface p-1 text-center">
            <canvas ref={previewRef} width={28} height={28} className="size-12 rounded-sm [image-rendering:pixelated]" aria-hidden="true" />
            <figcaption className="mt-0.5 text-[0.625rem] leading-tight text-subtle">AI sees</figcaption>
          </figure>
        </div>

        <div className="mt-3 flex min-h-[2.75rem] items-center justify-between gap-3" aria-live="polite">
          <p className="text-sm text-muted">
            {loadError ? (
              "The AI couldn't load. Refresh the page to try again."
            ) : !model ? (
              "Loading the AI…"
            ) : !probs ? (
              "The AI's guess will appear here."
            ) : confidence >= 0.5 ? (
              <>
                I think it&apos;s a <span className="text-2xl font-semibold tabular-nums text-fg align-middle">{best}</span>{" "}
                <span className="text-subtle">({Math.round(confidence * 100)}% sure)</span>
              </>
            ) : (
              <>
                Not sure… maybe a <span className="text-2xl font-semibold tabular-nums text-fg align-middle">{best}</span>?
              </>
            )}
          </p>
          <div className="flex shrink-0 gap-2">
            <button type="button" onClick={showExample} disabled={!model} className={actionClass}>
              <Sparkles className="size-4" aria-hidden="true" />
              Example
            </button>
            <button type="button" onClick={clear} disabled={!hasInk} className={actionClass}>
              <Eraser className="size-4" aria-hidden="true" />
              Clear
            </button>
          </div>
        </div>

        <div className="mt-2 grid grid-cols-10 gap-1" aria-label="How sure the AI is about each digit" role="img">
          {Array.from({ length: 10 }, (_, d) => {
            const p = probs ? probs[d] : 0;
            return (
              <div key={d} className="flex flex-col items-center gap-1">
                <div className="flex h-10 w-full items-end overflow-hidden rounded-sm bg-surface-2">
                  <div
                    className={`w-full rounded-sm transition-[height] duration-200 motion-reduce:transition-none ${d === best ? "bg-accent" : "bg-line-strong"}`}
                    style={{ height: `${Math.max(p * 100, probs ? 2 : 0)}%` }}
                  />
                </div>
                <span className={`text-xs tabular-nums ${d === best ? "font-semibold text-fg" : "text-subtle"}`}>{d}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* How it works */}
      <div
        role="tabpanel"
        id={`${baseId}-panel-info`}
        aria-labelledby={`${baseId}-tab-info`}
        hidden={tab !== "info"}
        className="mt-3 space-y-4 text-sm leading-relaxed text-muted"
      >
        <section>
          <h3 className="font-medium text-fg">How to play</h3>
          <ol className="mt-1.5 list-decimal space-y-1 pl-5 marker:text-subtle">
            <li>Draw one digit, from 0 to 9, in the box with your {touch ? "finger" : "mouse"}.</li>
            <li>The AI guesses while you draw. The bars show how sure it is about each digit.</li>
            <li>Press Clear to try another, or Example to see a real handwritten digit.</li>
          </ol>
          <p className="mt-1.5">Tip: draw it big and fill the box. Try a messy 4 or 9 to catch it out.</p>
        </section>
        <section>
          <h3 className="font-medium text-fg">What&apos;s happening</h3>
          <p className="mt-1.5">
            Your drawing is shrunk to a 28 × 28 pixel image, shown in the &quot;AI sees&quot; box. That is the same format as{" "}
            <span className="text-fg">MNIST</span>, a classic dataset of 70,000 handwritten digits.
          </p>
          <p className="mt-1.5">
            A small convolutional neural network, which learned from{" "}
            {model ? model.trainingImages.toLocaleString("en-GB") : "60,000"} of those images, picks out strokes, curves and
            loops, then scores each digit from 0 to 9.
            {model ? ` It gets ${(model.testAccuracy * 100).toFixed(1)}% of the 10,000 MNIST test digits right.` : ""}
          </p>
          <p className="mt-1.5">It runs entirely in your browser. Nothing you draw is sent anywhere.</p>
        </section>
        <p>
          <a
            href={TRAINING_CODE}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-accent underline decoration-accent/30 underline-offset-2 hover:decoration-accent"
          >
            See the training code on GitHub<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </p>
        <button type="button" onClick={() => setTab("play")} className={actionClass}>
          <Pencil className="size-4" aria-hidden="true" />
          Back to drawing
        </button>
      </div>
    </div>
  );
}
