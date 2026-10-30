// "Do you think like me?" — questions, scoring and result copy.
// Pure data and functions (no React), so the scoring can be tested on its own.

export type Quality = "determination" | "curiosity" | "resilience";
export const QUALITIES: Quality[] = ["determination", "curiosity", "resilience"];

export const QUALITY_LABEL: Record<Quality, string> = {
  determination: "Determination",
  curiosity: "Curiosity",
  resilience: "Resilience",
};

// How Mohith describes each quality (shown on the intro screen).
export const QUALITY_BLURB: Record<Quality, string> = {
  determination: "Taking responsibility, working hard and not giving up easily.",
  curiosity: "Enjoying learning, unfamiliar ideas and solving problems.",
  resilience: "Facing setbacks, adapting and moving forward.",
};

export type Answer = {
  text: string;
  // How strongly this answer signals each quality, 0 to 100.
  signal: Record<Quality, number>;
  // One sentence that reads the answer back to the visitor.
  reading: string;
};

export type Question = { quality: Quality; text: string; answers: Answer[] };

const s = (determination: number, curiosity: number, resilience: number) => ({ determination, curiosity, resilience });

export const QUESTIONS: Question[] = [
  {
    quality: "determination",
    text: "Do you believe that success comes from consistently putting in the effort, taking responsibility and refusing to give up when things become difficult?",
    answers: [
      { text: "Absolutely – persistence makes the difference.", signal: s(100, 50, 70),
        reading: "You back persistence: when something matters, you keep going until it is done." },
      { text: "Yes – but working smarter is just as important.", signal: s(85, 80, 65),
        reading: "You value effort, but you look for the smarter route rather than simply pushing harder." },
      { text: "Sometimes – it depends on the circumstances.", signal: s(55, 60, 55),
        reading: "You judge effort by context, choosing where persistence will genuinely pay off." },
      { text: "Not necessarily – knowing when to walk away matters too.", signal: s(35, 55, 50),
        reading: "You know when walking away is the wiser call, which takes real self-awareness." },
    ],
  },
  {
    quality: "curiosity",
    text: "When faced with something unfamiliar, a difficult problem or a challenge outside your comfort zone, what is your natural reaction?",
    answers: [
      { text: "I embrace it – I enjoy discovering and learning new things.", signal: s(65, 100, 70),
        reading: "Unfamiliar problems energise you; you treat them as a chance to learn." },
      { text: "I investigate, research and find a way forward.", signal: s(80, 90, 65),
        reading: "You meet the unknown methodically, researching until you find a way forward." },
      { text: "I feel uncertain initially but eventually give it a try.", signal: s(55, 60, 70),
        reading: "New challenges give you pause at first, yet you still step in and try." },
      { text: "I prefer situations where I already have experience.", signal: s(45, 30, 40),
        reading: "You do your best work on familiar ground, where experience gives you confidence." },
    ],
  },
  {
    quality: "resilience",
    text: "Everyone encounters setbacks. What matters most is how we respond. Which statement best reflects your approach?",
    answers: [
      { text: "I never let setbacks define me. I learn, adapt and come back stronger.", signal: s(85, 55, 100),
        reading: "Setbacks do not define you: you adapt and come back stronger." },
      { text: "I take time to reflect, learn from mistakes and try again.", signal: s(70, 80, 90),
        reading: "After a setback you reflect, learn from the mistake and try again." },
      { text: "I find challenges difficult but try to move forward.", signal: s(60, 45, 65),
        reading: "Setbacks feel heavy, but you keep moving forward, which is resilience in itself." },
      { text: "Sometimes setbacks make me reconsider my direction.", signal: s(40, 60, 45),
        reading: "Setbacks can prompt you to rethink your direction: a sign of reflection, not defeat." },
    ],
  },
];

// Mohith's own answers (index into each question's answers). Alignment is measured against these.
export const MY_ANSWERS = [0, 0, 0];

// The question about a quality counts for 70% of its score; the other two answers add 15% each,
// because one answer usually says something about more than one quality.
export const OWN_WEIGHT = 0.7;
export const OTHER_WEIGHT = 0.15;
// If the three scores sit within this many points of each other, the profile is "balanced".
export const BALANCED_SPREAD = 10;

export type CategoryId = "driven" | "curious" | "resilient" | "balanced";

export const CATEGORIES: Record<CategoryId, { title: string; summary: string }> = {
  driven: {
    title: "The Driven Achiever",
    summary: "You value persistence, responsibility and continuous improvement.",
  },
  curious: {
    title: "The Curious Thinker",
    summary: "You enjoy discovering new ideas, questioning assumptions and finding solutions.",
  },
  resilient: {
    title: "The Resilient Problem Solver",
    summary: "You see setbacks as part of growth and value learning through experience.",
  },
  balanced: {
    title: "The Balanced Mindset",
    summary: "You combine determination, curiosity and resilience in a thoughtful, adaptable way.",
  },
};

const CATEGORY_FOR: Record<Quality, CategoryId> = {
  determination: "driven",
  curiosity: "curious",
  resilience: "resilient",
};

export const STRENGTH_TEXT: Record<Quality, string> = {
  determination:
    "You take ownership and keep going when the work gets hard. That steadiness is often what turns a good idea into something finished.",
  curiosity:
    "You are drawn to the unfamiliar and like working out how things fit together. That is what keeps learning, and problem-solving, moving.",
  resilience:
    "Setbacks do not get the final word with you. You absorb them, adjust and carry on, which matters most when plans change.",
};

export type Scores = Record<Quality, number>;

export type MindsetResult = {
  scores: Scores; // each 0-100, rounded
  strongest: Quality;
  category: CategoryId;
  alignment: number; // 0-100, how close the scores are to Mohith's
  alignmentText: string;
  readings: string[]; // one sentence per answer
};

function rawScores(answers: number[]): Scores {
  const out = { determination: 0, curiosity: 0, resilience: 0 } as Scores;
  for (const q of QUALITIES) {
    out[q] = QUESTIONS.reduce((sum, question, i) => {
      const weight = question.quality === q ? OWN_WEIGHT : OTHER_WEIGHT;
      return sum + weight * question.answers[answers[i]].signal[q];
    }, 0);
  }
  return out;
}

function alignmentText(alignment: number): string {
  if (alignment >= 90) return "We think very much alike.";
  if (alignment >= 75) return "We share a lot of the same outlook.";
  if (alignment >= 60) return "We overlap in places and differ in others.";
  return "We see things differently, and different perspectives make for stronger teams.";
}

export function scoreMindset(answers: number[]): MindsetResult {
  if (answers.length !== QUESTIONS.length || answers.some((a, i) => !(a >= 0 && a < QUESTIONS[i].answers.length))) {
    throw new Error("scoreMindset needs one valid answer per question");
  }
  const raw = rawScores(answers);
  const mine = rawScores(MY_ANSWERS);
  // The rule works on the rounded scores the visitor sees, so the numbers on screen always explain the result.
  const scores = {
    determination: Math.round(raw.determination),
    curiosity: Math.round(raw.curiosity),
    resilience: Math.round(raw.resilience),
  };

  // Strongest quality: highest score; a tie goes to the quality whose own question scored higher.
  const own = (q: Quality) => QUESTIONS[QUALITIES.indexOf(q)].answers[answers[QUALITIES.indexOf(q)]].signal[q];
  const strongest = [...QUALITIES].sort((a, b) => scores[b] - scores[a] || own(b) - own(a))[0];

  const values = QUALITIES.map((q) => scores[q]);
  const spread = Math.max(...values) - Math.min(...values);
  const category: CategoryId = spread < BALANCED_SPREAD ? "balanced" : CATEGORY_FOR[strongest];

  // Alignment: 100 minus the average gap to Mohith's scores (scaled so the full range is used).
  const meanGap = QUALITIES.reduce((sum, q) => sum + Math.abs(raw[q] - mine[q]), 0) / QUALITIES.length;
  const alignment = Math.max(0, Math.min(100, Math.round(100 - 1.25 * meanGap)));

  return {
    scores,
    strongest,
    category,
    alignment,
    alignmentText: alignmentText(alignment),
    readings: answers.map((a, i) => QUESTIONS[i].answers[a].reading),
  };
}
