export function normalizeFeedback(raw: any): Feedback {
  const extractScore = (input: any): number =>
    typeof input === "number" && !isNaN(input)
      ? input
      : typeof input === "string"
      ? 5
      : 0;

  const safeTips = (
    tips: any[]
  ): {
    type: "improve" | "good";
    tip: string;
    explanation: string;
  }[] =>
    Array.isArray(tips) && tips.length > 0
      ? tips.map((tip: any) => ({
          type: tip?.type === "good" ? "good" : "improve",
          tip:
            typeof tip === "string"
              ? tip
              : typeof tip?.tip === "string"
              ? tip.tip
              : JSON.stringify(tip),
          explanation:
            typeof tip?.explanation === "string"
              ? tip.explanation
              : "No detailed explanation provided.",
        }))
      : [
          {
            type: "improve",
            tip: "No tips provided. Consider reviewing resume manually.",
            explanation: "The system did not return any specific suggestions.",
          },
        ];

  return {
    overall_rating: raw.overallScore ?? raw.overall_rating ?? 0,
    ATS: {
      score: extractScore(raw.ATS?.score ?? raw.ats_compatibility),
      tips: safeTips(raw.ATS?.tips ?? raw.ats_optimization_tips),
    },
    toneAndStyle: {
      score: extractScore((raw.formatting_and_design ?? 0) * 10),
      tips: safeTips(raw.toneAndStyle?.tips),
    },
    content: {
      score: extractScore((raw.content_quality) * 10),
      tips: safeTips(raw.content?.tips),
    },
    structure: {
      score: extractScore((raw.structure?.score ?? 0) * 10),
      tips: safeTips(raw.structure?.tips),
    },
    skills: {
      score: extractScore((raw.relevance_to_position ?? 0) * 10),
      tips: safeTips(raw.skills?.tips),
    },
  };
}
