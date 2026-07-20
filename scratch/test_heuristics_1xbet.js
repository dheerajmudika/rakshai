const { analyzeHeuristics } = require("../lib/ai/heuristics.ts");

const text = "https://indian.1xbet.com/en?v=2";

console.log("Analyzing text...");
const result = analyzeHeuristics(text);
console.log("Score:", result.score);
console.log("Verdict Scam (calculated as score >= 15 || strongSignalHit || length >= 2):");
const matched = result.signals.filter(s => s.matched);
const strongSignalHit = matched.some((s) => s.weight >= 0.4);
const verdict = result.score >= 15 || strongSignalHit || matched.length >= 2 ? "scam" : "safe";
console.log("Verdict:", verdict);
console.log("Matched Signals:", matched.map(s => `${s.label} (weight: ${s.weight})`));
