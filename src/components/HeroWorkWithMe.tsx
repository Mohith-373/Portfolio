"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Check, Compass, MessageCircle, Mountain, Puzzle, Quote, RotateCcw, type LucideIcon } from "lucide-react";
import { CLOSING_LINE, QUALITIES, STATEMENT, SURVEY, surveyOutcome } from "@/lib/workWithMe";
import { GameHeader, type GameTab } from "./GameTabs";

// "Do you like to work with someone like me?": three questions about what the visitor values in a
// teammate, each answered with a short reply from Mohith, ending on the mindset behind this portfolio.
// Answers live only in component state: nothing is stored or sent.

const QUALITY_ICONS: LucideIcon[] = [Mountain, Compass, Puzzle];
const STEPS = ["intro", "q0", "q1", "q2", "gathering", "mindset", "message"] as const;
type Step = (typeof STEPS)[number];
const LETTERS = ["A", "B", "C", "D"];

const primary =
  "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md bg-accent px-4 py-2 text-sm font-medium text-on-accent transition-[background-color,opacity] hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-accent";
const ghost =
  "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface-2 hover:text-fg";
const outline =
  "inline-flex items-center gap-1.5 rounded-md border border-line px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-surface-2";
const overline = "text-xs font-medium uppercase tracking-[0.14em] text-subtle";

export function HeroWorkWithMe() {
  const baseId = useId();
  const [tab, setTab] = useState<GameTab>("play");
  const [step, setStep] = useState<Step>("intro");
  const [dir, setDir] = useState<1 | -1>(1);
  const [answers, setAnswers] = useState<(number | null)[]>([null, null, null]);
  const headRef = useRef<HTMLElement | null>(null);
  const userMoved = useRef(false);
  const [scrollEl, setScrollEl] = useState<HTMLDivElement | null>(null);
  const [moreBelow, setMoreBelow] = useState(false);
  const [moreAbove, setMoreAbove] = useState(false);

  const complete = answers.every((a) => a !== null);
  const outcome = useMemo(() => (complete ? surveyOutcome(answers as number[]) : null), [answers, complete]);

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

  // After a visitor-driven change, move focus to the new step's heading (keyboard and screen-reader users).
  useEffect(() => {
    if (userMoved.current && step !== "gathering") headRef.current?.focus({ preventScroll: true });
  }, [step]);

  // Long questions on small screens: the middle of the card scrolls (Back/Next stay put) and fades
  // out at the bottom while there is more to see.
  useEffect(() => {
    if (!scrollEl) {
      setMoreBelow(false);
      setMoreAbove(false);
      return;
    }
    const check = () => {
      setMoreBelow(scrollEl.scrollHeight - scrollEl.scrollTop - scrollEl.clientHeight > 4);
      setMoreAbove(scrollEl.scrollTop > 4);
    };
    check();
    scrollEl.addEventListener("scroll", check, { passive: true });
    const ro = new ResizeObserver(check);
    ro.observe(scrollEl);
    if (scrollEl.firstElementChild) ro.observe(scrollEl.firstElementChild);
    return () => {
      scrollEl.removeEventListener("scroll", check);
      ro.disconnect();
    };
  }, [scrollEl]);

  // When a reply appears below the visible area, bring it into view (inside the card only, never the page).
  useEffect(() => {
    const reply = scrollEl?.querySelector<HTMLElement>("[data-reaction]");
    if (!scrollEl || !reply) return;
    const gap = reply.getBoundingClientRect().bottom - scrollEl.getBoundingClientRect().bottom;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (gap > 0) scrollEl.scrollBy({ top: gap + 8, behavior: smooth ? "smooth" : "auto" });
  }, [answers, scrollEl]);

  // A short "putting it together" moment before the final screen.
  useEffect(() => {
    if (step !== "gathering") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = window.setTimeout(() => setStep("mindset"), reduce ? 400 : 1500);
    return () => window.clearTimeout(t);
  }, [step]);

  const anim =
    dir === 1
      ? "motion-safe:animate-[survey-in-forward_0.38s_cubic-bezier(0.2,0.7,0.2,1)]"
      : "motion-safe:animate-[survey-in-back_0.38s_cubic-bezier(0.2,0.7,0.2,1)]";
  const rise = "motion-safe:animate-[survey-rise_0.45s_cubic-bezier(0.2,0.7,0.2,1)_both]";

  const setHead = (el: HTMLElement | null) => {
    headRef.current = el;
  };
  const fade =
    moreAbove && moreBelow
      ? "[mask-image:linear-gradient(to_bottom,transparent,black_10%,black_84%,transparent)]"
      : moreBelow
        ? "[mask-image:linear-gradient(to_bottom,black_82%,transparent)]"
        : moreAbove
          ? "[mask-image:linear-gradient(to_bottom,transparent,black_12%)]"
          : "";
  const middle = `-mx-1 mt-1 min-h-0 flex-1 overflow-y-auto px-1 ${fade}`;

  let body: ReactNode = null;

  if (step === "intro") {
    body = (
      <>
        <div className="flex flex-1 flex-col justify-center py-2">
          <p className={overline}>Three questions · 30 seconds</p>
          <h3 ref={setHead} tabIndex={-1} className="mt-2 text-2xl font-semibold leading-tight tracking-[-0.02em] text-balance text-fg outline-none @2xl:text-3xl">
            Do you like to work with someone like me?
          </h3>
          <p className="mt-2 text-pretty text-muted">Three questions. One personality. A mindset that doesn’t give up.</p>
          <p className="mt-4 text-sm leading-relaxed text-pretty text-muted">
            This one is about me, not you. Tell me what you value in the people you work with, and I’ll tell you how I work.
          </p>
          <ul className="mt-5 flex flex-wrap gap-2" aria-label="What the questions cover">
            {QUALITIES.map((q, k) => {
              const Icon = QUALITY_ICONS[k];
              return (
                <li key={q.title} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-bg/60 px-2.5 py-1 text-xs font-medium text-fg">
                  <Icon className="size-3.5 text-accent" aria-hidden="true" />
                  {SURVEY[k].topic}
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
    const q = SURVEY[i];
    const sel = answers[i];
    const Icon = QUALITY_ICONS[i];
    const answered = answers.filter((a) => a !== null).length;
    const qid = `${baseId}-q${i}`;
    const last = i === SURVEY.length - 1;

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
          <span className="shrink-0 text-muted">
            Question <span className="font-semibold tabular-nums text-fg">{i + 1}</span> of {SURVEY.length}
          </span>
          <span className="inline-flex min-w-0 items-center gap-1.5 rounded-full bg-surface-2 px-2.5 py-0.5 text-xs font-medium text-fg">
            <Icon className="size-3.5 shrink-0 text-accent" aria-hidden="true" />
            <span className="truncate">{q.topic}</span>
          </span>
        </div>
        <div
          className="mt-2.5 flex gap-1.5"
          role="progressbar"
          aria-label="Questions answered"
          aria-valuemin={0}
          aria-valuemax={SURVEY.length}
          aria-valuenow={answered}
          aria-valuetext={`${answered} of ${SURVEY.length} answered`}
        >
          {SURVEY.map((_, k) => (
            <span key={k} className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
              <span
                className="block h-full rounded-full bg-accent transition-[width,opacity] duration-500 ease-out"
                style={{ width: answers[k] !== null ? "100%" : k === i ? "30%" : "0%", opacity: answers[k] !== null ? 1 : 0.45 }}
              />
            </span>
          ))}
        </div>

        <div ref={setScrollEl} className={middle} data-middle>
          <div className="flex min-h-full flex-col justify-center py-3 @sm:py-4">
            {q.lead ? <p className="mb-2 text-[0.78rem] leading-snug text-pretty text-muted @sm:text-[0.8125rem] @2xl:text-sm">{q.lead}</p> : null}
            <h3 id={qid} ref={setHead} tabIndex={-1} className="text-[0.95rem] font-medium leading-snug text-pretty text-fg outline-none @sm:text-[1.0625rem] @2xl:text-xl">
              {q.text}
            </h3>
            <div role="radiogroup" aria-labelledby={qid} className="mt-3 grid gap-1.5 @sm:mt-4 @sm:grid-cols-2 @sm:gap-2">
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
                    className={`group flex w-full items-start gap-2.5 rounded-xl border px-2.5 py-2 text-left transition-[background-color,border-color,box-shadow,transform] duration-200 active:scale-[0.99] motion-reduce:active:scale-100 @sm:gap-3 @sm:p-3 @2xl:p-3.5 ${
                      on
                        ? "border-accent bg-accent-soft shadow-[0_0_0_1px_var(--accent)]"
                        : "border-line bg-surface hover:-translate-y-px hover:border-line-strong hover:shadow-sm motion-reduce:hover:translate-y-0"
                    }`}
                  >
                    <span
                      className={`grid size-6 shrink-0 place-items-center rounded-md border text-xs font-semibold transition-colors ${
                        on ? "border-accent bg-accent text-on-accent" : "border-line-strong text-muted group-hover:text-fg"
                      }`}
                      aria-hidden="true"
                    >
                      {on ? <Check className="size-3.5 motion-safe:animate-[survey-pop_0.22s_ease-out]" strokeWidth={3} /> : LETTERS[j]}
                    </span>
                    <span className={`pt-0.5 text-[0.8125rem] leading-snug @sm:text-sm @2xl:text-[0.95rem] ${on ? "text-fg" : "text-muted group-hover:text-fg"}`}>
                      {a.text}
                    </span>
                  </button>
                );
              })}
            </div>
            {/* Mohith's reply to the chosen answer. Space is kept so nothing jumps when it appears. */}
            <p className="mt-2.5 text-[0.8125rem] leading-snug @sm:min-h-[2.5rem] @sm:text-sm" aria-live="polite" data-reaction>
              {sel !== null ? (
                <span key={`${i}-${sel}`} className={`flex items-start gap-2 ${rise}`}>
                  <MessageCircle className="mt-0.5 size-3.5 shrink-0 text-accent" aria-hidden="true" />
                  <span>
                    <span className="font-medium text-fg">Me: </span>
                    <span className="text-muted">{q.answers[sel].reaction}</span>
                  </span>
                </span>
              ) : null}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-2">
          <button type="button" onClick={() => go(i === 0 ? "intro" : (`q${i - 1}` as Step))} className={ghost}>
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back
          </button>
          <div className="flex items-center gap-3">
            {sel === null ? <span className="hidden text-xs text-subtle @sm:inline">Choose an answer to continue</span> : null}
            <button type="button" disabled={sel === null} onClick={() => go(last ? "gathering" : (`q${i + 1}` as Step))} className={primary}>
              {last ? "See what it says" : "Next"}
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </>
    );
  } else if (step === "gathering") {
    body = (
      <div className="flex flex-1 flex-col items-center justify-center py-6 text-center" role="status">
        <span className="relative grid size-14 place-items-center">
          <span className="absolute inset-0 rounded-full border-2 border-surface-2" />
          <span className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent motion-safe:animate-spin" />
          <Puzzle className="size-5 text-accent" aria-hidden="true" />
        </span>
        <p className="mt-4 font-medium text-fg">Putting it all together…</p>
        <ul className="mt-4 space-y-1.5 text-sm text-muted" aria-hidden="true">
          {QUALITIES.map((q, k) => (
            <li key={q.title} className={`flex items-center justify-center gap-2 ${rise}`} style={{ animationDelay: `${0.2 + k * 0.3}s` }}>
              <Check className="size-3.5 text-accent" strokeWidth={3} />
              {q.title}
            </li>
          ))}
        </ul>
      </div>
    );
  } else if (outcome && step === "mindset") {
    body = (
      <>
        <div className="flex items-center justify-between">
          <p className={overline}>Your answers, my mindset</p>
          <p className="text-xs tabular-nums text-subtle">1 / 2</p>
        </div>
        <div ref={setScrollEl} className={middle} data-middle>
          <div className="flex min-h-full flex-col justify-center py-3 @sm:py-4">
            <h3 ref={setHead} tabIndex={-1} className="text-lg font-semibold leading-tight tracking-[-0.015em] text-balance text-fg outline-none @sm:text-2xl">
              That’s the mindset behind this portfolio.
            </h3>
            <p className="mt-2 text-sm leading-snug text-pretty text-muted">{outcome.fitLine}</p>
            <ul className="mt-3 space-y-1.5 @sm:mt-4 @sm:space-y-2">
              {QUALITIES.map((q, k) => {
                const Icon = QUALITY_ICONS[k];
                return (
                  <li key={q.title} className={`flex gap-3 rounded-xl border border-line bg-bg/60 px-3 py-2 @sm:p-3 ${rise}`} style={{ animationDelay: `${k * 0.12}s` }}>
                    <span className="hidden size-8 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent @sm:grid">
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-baseline justify-between gap-x-2">
                        <span className="font-semibold text-fg">{q.title}</span>
                        <span className="text-xs text-subtle">You: {outcome.echoes[k]}</span>
                      </span>
                      <span className="block text-[0.8125rem] leading-snug text-muted @sm:text-sm">{q.text}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 pt-2">
          <button type="button" onClick={() => go("q2")} className={ghost}>
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back
          </button>
          <button type="button" onClick={() => go("message")} className={primary}>
            One more thing
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      </>
    );
  } else if (outcome && step === "message") {
    const [first, ...rest] = CLOSING_LINE.split(". ");
    body = (
      <>
        <div className="flex items-center justify-between">
          <p className={overline}>One more thing</p>
          <p className="text-xs tabular-nums text-subtle">2 / 2</p>
        </div>
        <div className="flex flex-1 flex-col justify-center py-3 @sm:py-4">
          <Quote className="size-6 text-accent opacity-60" aria-hidden="true" />
          <blockquote className="mt-2">
            <p ref={setHead} tabIndex={-1} className="text-lg font-medium leading-snug tracking-[-0.01em] text-pretty text-fg outline-none @md:text-xl">
              {STATEMENT}
            </p>
          </blockquote>
          <p className={`mt-6 border-t border-line pt-5 text-lg font-semibold leading-snug tracking-[-0.01em] text-balance text-fg @md:text-xl ${rise}`} style={{ animationDelay: "0.25s" }}>
            <span className="text-accent">{first}.</span> {rest.join(". ")}
          </p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <button type="button" onClick={() => go("mindset")} className={ghost}>
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
      data-game="work"
      data-tab={tab}
      data-step={step}
      data-answers={answers.map((a) => (a === null ? "-" : a)).join(",")}
      data-fit={outcome?.fit}
    >
      {/* Content is laid over the card so this game takes the height set by the other games
          (no jump between questions); on very small screens it scrolls instead. */}
      <div className="absolute inset-0 flex flex-col overflow-y-auto overscroll-contain p-4 sm:p-5" data-scroll>
        <GameHeader baseId={baseId} title="Work with me?" shortTitle="About me" dotClass="bg-[#d9a12b]" tab={tab} onTab={setTab} />

        {/* Play */}
        <div role="tabpanel" id={`${baseId}-panel-play`} aria-labelledby={`${baseId}-tab-play`} hidden={tab !== "play"} className="mt-3 flex min-h-0 flex-1 flex-col">
          <div key={step} className={`flex min-h-0 flex-1 flex-col motion-reduce:animate-none ${anim}`}>
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
              Answer three quick questions, one at a time, about what you value in someone you work with. I reply to each
              answer, and you can go back and change one whenever you like.
            </p>
          </section>
          <section>
            <h3 className="font-medium text-fg">What it tells you</h3>
            <p className="mt-1.5">
              This is about me, not you. Each question covers one side of how I work: not giving up, learning what I don’t
              know yet, and putting the two together. The ending shows how your answers line up with that.
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
