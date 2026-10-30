"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Check, Compass, Mountain, Quote, RotateCcw, Sprout, type LucideIcon } from "lucide-react";
import {
  BALANCED_SPREAD,
  CATEGORIES,
  QUALITIES,
  QUALITY_BLURB,
  QUALITY_LABEL,
  QUESTIONS,
  STRENGTH_TEXT,
  scoreMindset,
  type Quality,
} from "@/lib/mindset";
import { GameHeader, type GameTab } from "./GameTabs";

// "Do you think like me?": three questions, one at a time, then a scored mindset profile.
// Answers live only in component state: nothing is stored or sent.

const ICON: Record<Quality, LucideIcon> = { determination: Mountain, curiosity: Compass, resilience: Sprout };

const STEPS = ["intro", "q0", "q1", "q2", "calculating", "result", "reading", "closing"] as const;
type Step = (typeof STEPS)[number];
const LETTERS = ["A", "B", "C", "D"];

const primary =
  "inline-flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-sm font-medium text-on-accent transition-[background-color,opacity] hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-accent";
const ghost =
  "inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface-2 hover:text-fg";
const overline = "text-xs font-medium uppercase tracking-[0.14em] text-subtle";
const outline =
  "inline-flex items-center gap-1.5 rounded-md border border-line px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-surface-2";

export function HeroMindsetGame() {
  const baseId = useId();
  const [tab, setTab] = useState<GameTab>("play");
  const [step, setStep] = useState<Step>("intro");
  const [dir, setDir] = useState<1 | -1>(1);
  const [answers, setAnswers] = useState<(number | null)[]>([null, null, null]);
  const headRef = useRef<HTMLElement | null>(null);
  const userMoved = useRef(false);

  const complete = answers.every((a) => a !== null);
  const result = useMemo(() => (complete ? scoreMindset(answers as number[]) : null), [answers, complete]);

  function go(next: Step) {
    setDir(STEPS.indexOf(next) >= STEPS.indexOf(step) ? 1 : -1);
    userMoved.current = true;
    setStep(next);
  }

  function restart() {
    setAnswers([null, null, null]);
    userMoved.current = true;
    setDir(1);
    setStep("q0");
  }

  // Move focus to the new step's heading after a visitor-driven change (keeps keyboard and screen-reader users oriented).
  useEffect(() => {
    if (userMoved.current && step !== "calculating") headRef.current?.focus({ preventScroll: true });
  }, [step]);

  // Short "reading your answers" moment before the result.
  useEffect(() => {
    if (step !== "calculating") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = window.setTimeout(() => setStep("result"), reduce ? 400 : 1500);
    return () => window.clearTimeout(t);
  }, [step]);

  const anim =
    dir === 1
      ? "motion-safe:animate-[mindset-in-forward_0.38s_cubic-bezier(0.2,0.7,0.2,1)]"
      : "motion-safe:animate-[mindset-in-back_0.38s_cubic-bezier(0.2,0.7,0.2,1)]";

  const setHead = (el: HTMLElement | null) => {
    headRef.current = el;
  };

  let body: ReactNode;

  if (step === "intro") {
    body = (
      <>
        <div className="flex flex-1 flex-col justify-center py-2">
          <p className={overline}>A 30-second reflection</p>
          <h3 ref={setHead} tabIndex={-1} className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-fg outline-none">
            Do you think like me?
          </h3>
          <p className="mt-1 text-pretty text-muted">Three questions. Three qualities. One mindset.</p>
          <ul className="mt-4 grid gap-2 @sm:mt-5 @sm:gap-2.5 @xl:grid-cols-3">
            {QUALITIES.map((q) => {
              const Icon = ICON[q];
              return (
                <li key={q} className="flex gap-3 rounded-xl border border-line bg-bg/60 p-2.5 @sm:p-3 @xl:flex-col">
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-medium text-fg">{QUALITY_LABEL[q]}</span>
                    <span className="block text-sm leading-snug text-muted">{QUALITY_BLURB[q]}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-xs text-subtle">No sign-up. Nothing is stored.</p>
          <button type="button" onClick={() => go("q0")} className={primary}>
            Start
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      </>
    );
  } else if (step === "q0" || step === "q1" || step === "q2") {
    const i = Number(step[1]);
    const q = QUESTIONS[i];
    const sel = answers[i];
    const Icon = ICON[q.quality];
    const answered = answers.filter((a) => a !== null).length;
    const qid = `${baseId}-q${i}`;

    const choose = (j: number) => setAnswers((prev) => prev.map((a, k) => (k === i ? j : a)));
    const onKey = (e: KeyboardEvent<HTMLButtonElement>, j: number) => {
      const delta = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
      if (!delta) return;
      e.preventDefault();
      const next = (j + delta + q.answers.length) % q.answers.length;
      choose(next);
      document.getElementById(`${qid}-a${next}`)?.focus();
    };

    body = (
      <>
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted">
            Question <span className="font-semibold tabular-nums text-fg">{i + 1}</span> of {QUESTIONS.length}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-2.5 py-0.5 text-xs font-medium text-fg">
            <Icon className="size-3.5 text-accent" aria-hidden="true" />
            {QUALITY_LABEL[q.quality]}
          </span>
        </div>
        <div
          className="mt-2.5 flex gap-1.5"
          role="progressbar"
          aria-label="Questions answered"
          aria-valuemin={0}
          aria-valuemax={QUESTIONS.length}
          aria-valuenow={answered}
          aria-valuetext={`${answered} of ${QUESTIONS.length} answered`}
        >
          {QUESTIONS.map((_, k) => (
            <span key={k} className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
              <span
                className="block h-full rounded-full bg-accent transition-[width,opacity] duration-500 ease-out"
                style={{ width: answers[k] !== null ? "100%" : k === i ? "30%" : "0%", opacity: answers[k] !== null ? 1 : 0.45 }}
              />
            </span>
          ))}
        </div>

        <div className="flex flex-1 flex-col justify-center py-3 @sm:py-4">
          <h3 id={qid} ref={setHead} tabIndex={-1} className="text-[0.95rem] font-medium leading-snug text-pretty text-fg outline-none @sm:text-[1.0625rem] @2xl:text-xl">
            {q.text}
          </h3>
          <div role="radiogroup" aria-labelledby={qid} className="mt-3 grid gap-1.5 @sm:mt-4 @sm:gap-2 @xl:grid-cols-2">
            {q.answers.map((a, j) => {
              const on = sel === j;
              return (
                <button
                  key={j}
                  id={`${qid}-a${j}`}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  tabIndex={on || (sel === null && j === 0) ? 0 : -1}
                  onClick={() => choose(j)}
                  onKeyDown={(e) => onKey(e, j)}
                  data-answer={j}
                  className={`group flex w-full items-start gap-3 rounded-xl border p-2.5 text-left @sm:p-3 transition-[background-color,border-color,box-shadow,transform] duration-200 active:scale-[0.99] motion-reduce:active:scale-100 ${
                    on
                      ? "border-accent bg-accent-soft shadow-[0_0_0_1px_var(--accent)]"
                      : "border-line bg-surface hover:-translate-y-px hover:border-line-strong hover:shadow-sm motion-reduce:hover:translate-y-0"
                  }`}
                >
                  <span
                    className={`mt-px grid size-6 shrink-0 place-items-center rounded-md border text-xs font-semibold transition-colors ${
                      on ? "border-accent bg-accent text-on-accent" : "border-line-strong text-muted group-hover:text-fg"
                    }`}
                    aria-hidden="true"
                  >
                    {on ? <Check className="size-3.5 motion-safe:animate-[mindset-pop_0.22s_ease-out]" strokeWidth={3} /> : LETTERS[j]}
                  </span>
                  <span className={`text-sm leading-snug @2xl:text-[0.95rem] ${on ? "text-fg" : "text-muted group-hover:text-fg"}`}>{a.text}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <button type="button" onClick={() => go(i === 0 ? "intro" : (`q${i - 1}` as Step))} className={ghost}>
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back
          </button>
          <div className="flex items-center gap-3">
            {sel === null ? <span className="hidden text-xs text-subtle @sm:inline">Choose an answer to continue</span> : null}
            <button
              type="button"
              disabled={sel === null}
              onClick={() => go(i === QUESTIONS.length - 1 ? "calculating" : (`q${i + 1}` as Step))}
              className={primary}
            >
              {i === QUESTIONS.length - 1 ? "See my result" : "Next"}
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </>
    );
  } else if (step === "calculating") {
    body = (
      <div className="flex flex-1 flex-col items-center justify-center py-6 text-center" role="status">
        <span className="relative grid size-14 place-items-center">
          <span className="absolute inset-0 rounded-full border-2 border-surface-2" />
          <span className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent motion-safe:animate-spin" />
          <Check className="size-5 text-accent" aria-hidden="true" />
        </span>
        <p className="mt-4 font-medium text-fg">Reading your answers…</p>
        <div className="mt-5 w-full max-w-60 space-y-2.5 text-left" aria-hidden="true">
          {QUALITIES.map((q, k) => (
            <div key={q}>
              <span className="text-xs text-muted">{QUALITY_LABEL[q]}</span>
              <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-surface-2">
                <span
                  className="block h-full origin-left rounded-full bg-accent motion-safe:animate-[mindset-fill_0.8s_cubic-bezier(0.2,0.7,0.2,1)_both]"
                  style={{ animationDelay: `${k * 0.2}s` }}
                />
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  } else if (result && step === "result") {
    const cat = CATEGORIES[result.category];
    body = (
      <>
        <div className="flex items-center justify-between">
          <p className={overline}>Your result</p>
          <p className="text-xs tabular-nums text-subtle">1 / 3</p>
        </div>
        <div className="flex flex-1 flex-col justify-center gap-4 py-3 @sm:gap-5 @sm:py-4">
          <div className="flex items-center gap-4">
            <AlignmentRing value={result.alignment} />
            <div className="min-w-0">
              <h3 ref={setHead} tabIndex={-1} className="text-xl font-semibold leading-tight tracking-[-0.015em] text-balance text-fg outline-none">
                {cat.title}
              </h3>
              <p className="mt-1.5 text-sm leading-snug text-muted">{cat.summary}</p>
            </div>
          </div>
          <p className="text-sm leading-snug text-muted">
            <span className="font-medium text-fg">{result.alignment}% mindset alignment with me.</span> {result.alignmentText}
          </p>
          <ScoreBars scores={result.scores} strongest={result.strongest} />
        </div>
        <div className="flex items-center justify-between gap-3">
          <button type="button" onClick={() => go("q2")} className={ghost}>
            <ArrowLeft className="size-4" aria-hidden="true" />
            Edit answers
          </button>
          <button type="button" onClick={() => go("reading")} className={primary}>
            Your answers
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      </>
    );
  } else if (result && step === "reading") {
    const StrongIcon = ICON[result.strongest];
    body = (
      <>
        <div className="flex items-center justify-between">
          <p className={overline}>What your answers say</p>
          <p className="text-xs tabular-nums text-subtle">2 / 3</p>
        </div>
        <div className="flex flex-1 flex-col justify-center py-4">
          <div className="rounded-xl border border-line bg-bg/60 p-3 @sm:p-4">
            <p className="text-xs text-subtle">Your strongest quality</p>
            <h3 ref={setHead} tabIndex={-1} className="mt-1 flex items-center gap-2 text-lg font-semibold text-fg outline-none">
              <StrongIcon className="size-4.5 text-accent" aria-hidden="true" />
              {QUALITY_LABEL[result.strongest]}
              <span className="text-sm font-normal tabular-nums text-subtle">{result.scores[result.strongest]}/100</span>
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{STRENGTH_TEXT[result.strongest]}</p>
          </div>
          <ul className="mt-3 space-y-2.5 @sm:mt-4 @sm:space-y-3">
            {result.readings.map((reading, k) => {
              const quality = QUESTIONS[k].quality;
              const Icon = ICON[quality];
              return (
                <li key={k} className="flex gap-3 text-sm leading-snug">
                  <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-surface-2 text-muted">
                    <Icon className="size-3.5" aria-hidden="true" />
                  </span>
                  <span className="pt-0.5">
                    <span className="font-medium text-fg">{QUALITY_LABEL[quality]}.</span> <span className="text-muted">{reading}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="flex items-center justify-between gap-3">
          <button type="button" onClick={() => go("result")} className={ghost}>
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back
          </button>
          <button type="button" onClick={() => go("closing")} className={primary}>
            Final thought
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      </>
    );
  } else if (result && step === "closing") {
    body = (
      <>
        <div className="flex items-center justify-between">
          <p className={overline}>One last thought</p>
          <p className="text-xs tabular-nums text-subtle">3 / 3</p>
        </div>
        <div className="flex flex-1 flex-col justify-center py-4">
          <Quote className="size-6 text-accent opacity-60" aria-hidden="true" />
          <blockquote className="mt-2">
            <p ref={setHead} tabIndex={-1} className="text-lg font-medium leading-snug tracking-[-0.01em] text-pretty text-fg outline-none @md:text-xl">
              Success isn’t just about what you know. It’s about how you think, how you respond to challenges and how willing you
              are to keep growing.
            </p>
          </blockquote>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Whatever your result, remember that the strongest mindset isn’t about being perfect. It’s about being willing to
            learn, adapt and improve.
          </p>
          <h3 className="mt-6 border-t border-line pt-5 font-semibold tracking-[-0.01em] text-balance text-fg">
            Different perspectives. Shared ambition. Endless possibilities.
          </h3>
        </div>
        <div className="flex items-center justify-between gap-3">
          <button type="button" onClick={() => go("reading")} className={ghost}>
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back
          </button>
          <button type="button" onClick={restart} className={primary}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Restart
          </button>
        </div>
      </>
    );
  }

  return (
    <div
      className="@container relative h-full rounded-2xl border border-line bg-surface"
      data-game="mindset"
      data-tab={tab}
      data-step={step}
      data-answers={answers.map((a) => (a === null ? "-" : a)).join(",")}
      data-category={result?.category}
      data-alignment={result?.alignment}
      data-scores={result ? QUALITIES.map((q) => result.scores[q]).join(",") : undefined}
    >
      {/* Content is laid over the card so this game takes the height set by the other games
          (no jump when moving between questions); on very small screens it scrolls instead. */}
      <div className="absolute inset-0 flex flex-col overflow-y-auto overscroll-contain p-4 sm:p-5" data-scroll>
        <GameHeader baseId={baseId} title="Think like me?" shortTitle="Mindset" dotClass="bg-[#d9a12b]" tab={tab} onTab={setTab} />

        {/* Play */}
        <div role="tabpanel" id={`${baseId}-panel-play`} aria-labelledby={`${baseId}-tab-play`} hidden={tab !== "play"} className="mt-3 flex flex-1 flex-col">
          <div key={step} className={`flex flex-1 flex-col motion-reduce:animate-none ${anim}`}>
            {body}
          </div>
        </div>

        {/* How it works */}
        <div
          role="tabpanel"
          id={`${baseId}-panel-info`}
          aria-labelledby={`${baseId}-tab-info`}
          hidden={tab !== "info"}
          className="mt-3 space-y-3 text-sm leading-relaxed text-muted @sm:space-y-4"
        >
          <section>
            <h3 className="font-medium text-fg">How to play</h3>
            <p className="mt-1.5">
              Answer three questions, one at a time. There are no right or wrong answers: pick the one closest to you. You can
              go back and change an answer at any point.
            </p>
          </section>
          <section>
            <h3 className="font-medium text-fg">How your result is worked out</h3>
            <p className="mt-1.5">
              Every answer says something about all three qualities. The question about a quality counts for 70% of its score;
              your other two answers add 15% each. Scores within {BALANCED_SPREAD} points of each other give The Balanced
              Mindset; otherwise your strongest quality sets your profile. Alignment compares your scores with mine (I chose the
              first answer to each question).
            </p>
          </section>
          <p>Your answers stay on this page and are cleared when you restart or leave. Nothing is stored or sent.</p>
          <button type="button" onClick={() => setTab("play")} className={outline}>
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to the questions
          </button>
        </div>
      </div>
    </div>
  );
}

// Circular gauge for the alignment percentage; fills and counts up when it appears.
function AlignmentRing({ value }: { value: number }) {
  const r = 42;
  const c = 2 * Math.PI * r;
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 900);
      setShown(Math.round(value * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return (
    <div className="relative size-[5.5rem] shrink-0" role="img" aria-label={`${value}% mindset alignment`}>
      <svg viewBox="0 0 100 100" className="size-full -rotate-90" aria-hidden="true">
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--surface-2)" strokeWidth="8" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - shown / 100)}
        />
      </svg>
      <span className="absolute inset-0 flex flex-col items-center justify-center" aria-hidden="true">
        <span className="text-xl font-semibold tabular-nums leading-none text-fg">{shown}%</span>
        <span className="mt-1 text-[0.625rem] uppercase tracking-[0.12em] text-subtle">aligned</span>
      </span>
    </div>
  );
}

// One bar per quality; the strongest is drawn in full accent colour.
function ScoreBars({ scores, strongest }: { scores: Record<Quality, number>; strongest: Quality }) {
  const [grown, setGrown] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setGrown(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <ul className="space-y-3" aria-label="Your scores out of 100">
      {QUALITIES.map((q, k) => {
        const Icon = ICON[q];
        const top = q === strongest;
        return (
          <li key={q}>
            <div className="flex items-center justify-between gap-2 text-sm">
              <span className="inline-flex items-center gap-1.5 font-medium text-fg">
                <Icon className={`size-3.5 ${top ? "text-accent" : "text-subtle"}`} aria-hidden="true" />
                {QUALITY_LABEL[q]}
                {top ? <span className="rounded-full bg-accent-soft px-1.5 py-px text-[0.65rem] font-medium text-accent">Strongest</span> : null}
              </span>
              <span className="tabular-nums text-muted">
                {scores[q]}
                <span className="sr-only"> out of 100</span>
              </span>
            </div>
            <span className="mt-1.5 block h-2 overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
              <span
                className={`block h-full rounded-full transition-[width] duration-700 ease-out ${top ? "bg-accent" : "bg-accent/45"}`}
                style={{ width: grown ? `${scores[q]}%` : "0%", transitionDelay: `${k * 120}ms` }}
              />
            </span>
          </li>
        );
      })}
    </ul>
  );
}
