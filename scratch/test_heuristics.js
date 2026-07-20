const { analyzeHeuristics } = require("../lib/ai/heuristics.ts");

const text = `Mom, this is my new number. I lost my phone and urgently need ₹18,500 transferred to my account immediately. Please don't call because I'm in an important meeting.
Send it to:
Name: Rahul Sharma
Bank: ABC Bank
A/C No.: 9876543210987654
IFSC: ABCD0123456
Please send it as soon as possible and message me once it's done.`;

console.log("Analyzing text...");
const result = analyzeHeuristics(text);
console.log("Score:", result.score);
console.log("Matched Signals:", result.signals.filter(s => s.matched).map(s => s.label));
