export type Question = {
  question: string;
  answer: Record<"A" | "B" | "C" | "D", string>;
  id: string;
  correctAnswer: string;
  ['tag_type']: string;
};