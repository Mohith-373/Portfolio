// "Do you like to work with someone like me?" — the survey content.
// The survey is about Mohith, not the visitor: answers only change how the ending is framed.
// Pure data and functions (no React), so the logic can be tested on its own.

export type SurveyAnswer = {
  text: string;
  short: string; // how the answer is echoed back on the final screen ("You: …")
  reaction: string; // a short reply from Mohith, shown when the answer is picked
  warmth: number; // 0-3, how strongly the answer values this quality
};

export type SurveyQuestion = {
  topic: string;
  lead?: string; // optional set-up shown above the question
  text: string;
  answers: SurveyAnswer[];
};

export const SURVEY: SurveyQuestion[] = [
  {
    topic: "Determination",
    text: "Are you looking for someone who can handle responsibilities, take on challenging work and keep trying rather than give up when things become difficult?",
    answers: [
      { text: "Absolutely. I value someone who takes responsibility and never gives up easily.", short: "Absolutely", warmth: 3,
        reaction: "Good news: giving up easily isn’t really my style." },
      { text: "Yes. I appreciate someone who stays committed and finds solutions.", short: "Yes", warmth: 3,
        reaction: "Committed and solution-focused: that’s exactly how I like to work." },
      { text: "It depends on the situation.", short: "It depends", warmth: 1.5,
        reaction: "Fair enough. When it does matter, I’m the one still looking for a way forward." },
      { text: "I prefer someone who avoids unnecessary challenges.", short: "Fewer challenges", warmth: 0,
        reaction: "Noted. I don’t go looking for trouble, but I don’t run from hard work either." },
    ],
  },
  {
    topic: "Curiosity and learning",
    text: "Would you appreciate working with someone who is willing to explore unfamiliar things, learn something completely new and figure out how to solve problems, even when they have no previous experience?",
    answers: [
      { text: "Absolutely. I admire someone who is always willing to learn.", short: "Absolutely", warmth: 3,
        reaction: "Then we’d get on. “I’ve never done this before” is usually where I start." },
      { text: "Yes. Being curious and adaptable is important.", short: "Yes", warmth: 3,
        reaction: "Agreed. Curiosity has taught me most of what I know." },
      { text: "I appreciate it, although experience matters too.", short: "Experience matters too", warmth: 1.5,
        reaction: "It does. I’m building mine one unfamiliar problem at a time." },
      { text: "I prefer someone who sticks to what they already know.", short: "Stick to what’s known", warmth: 0,
        reaction: "Understood. I’d still be the one quietly reading the documentation." },
    ],
  },
  {
    topic: "My overall mentality",
    lead: "Imagine this portfolio belongs to someone who has both qualities mentioned above: someone who does not give up when work becomes challenging and someone who is willing to learn, explore and figure out even the most unfamiliar things.",
    text: "Would you appreciate this kind of mentality in someone you work with?",
    answers: [
      { text: "Absolutely. That’s exactly the kind of mentality I value.", short: "Absolutely", warmth: 3,
        reaction: "Then you’re in the right place." },
      { text: "Yes. Determination and willingness to learn are important qualities.", short: "Yes", warmth: 3,
        reaction: "Couldn’t agree more. That’s the idea behind everything in this portfolio." },
      { text: "I appreciate this mindset and would like to see it in action.", short: "Show me in action", warmth: 2,
        reaction: "Good plan: my projects, just below, are a fair place to start." },
      { text: "It’s a good mentality, although everyone has a different approach.", short: "Everyone’s different", warmth: 1,
        reaction: "True. This is simply how I work, and I’m always open to other approaches." },
    ],
  },
];

// Mohith's three core qualities, one per question. Always shown on the final screen.
export const QUALITIES = [
  { title: "I don’t give up", text: "Challenges motivate me to find another way forward." },
  { title: "I am always willing to learn", text: "Not knowing something is an opportunity to discover it." },
  { title: "I believe in figuring things out", text: "I approach unfamiliar situations with curiosity, patience and determination." },
];

export const STATEMENT =
  "I’m not someone who claims to know everything. I’m someone who is willing to learn anything, take on challenges and keep going until I find a way forward.";
export const CLOSING_LINE = "You don’t have to know everything. You just have to be willing to figure it out.";

export type FitId = "aligned" | "mostly" | "different" | "apart";

// One opening line for the final screen, depending on how much the visitor values these qualities.
export const FIT_LINE: Record<FitId, string> = {
  aligned: "Sounds like we value the same things. That’s a good start for working together.",
  mostly: "We value a lot of the same things, which is a good place to start.",
  different: "We might approach some things differently, and different approaches make strong teams.",
  apart: "We’d probably approach things differently, and that’s fine. Here’s how I work.",
};

export function surveyOutcome(answers: number[]) {
  if (answers.length !== SURVEY.length || answers.some((a, i) => !(a >= 0 && a < SURVEY[i].answers.length))) {
    throw new Error("surveyOutcome needs one valid answer per question");
  }
  const picked = answers.map((a, i) => SURVEY[i].answers[a]);
  const warmth = picked.reduce((sum, a) => sum + a.warmth, 0); // 0 to 9
  const fit: FitId = warmth >= 8 ? "aligned" : warmth >= 5 ? "mostly" : warmth >= 2 ? "different" : "apart";
  return {
    fit,
    fitLine: FIT_LINE[fit],
    echoes: picked.map((a) => a.short), // one per quality, in order
  };
}
