// Sends Java code + recalled Hindsight memories to Groq and returns a structured review.
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const GroqSdk = require('groq-sdk');
const Groq = GroqSdk.default || GroqSdk;

const MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-20b';
// Models that support Groq Structured Outputs (json_schema). Others fall back to JSON mode.
const STRICT_SCHEMA_MODELS = ['openai/gpt-oss-20b', 'openai/gpt-oss-120b'];
const MAX_CODE_CHARS = 12000;

const SYSTEM_PROMPT = `You are CodeMentor AI, a senior Java backend code reviewer.

Review Java code for:
- bugs
- null handling
- exception handling
- naming
- readability
- maintainability
- clean code
- unnecessary complexity
- Java best practices
- performance problems
- basic security problems
- backend design issues

Do not invent problems that do not exist.
Do not criticize code simply for stylistic preference.
Give concise and actionable feedback.

DEVELOPER MEMORY RULES:
- You may be given memories from this developer's previous reviews.
- Use them only when relevant to the current code.
- If the current code repeats a pattern from memory, say so directly in that issue's
  explanation (for example: "You've had this issue in earlier reviews") and suggest a
  reusable habit, not just a one-off fix.
- "memoryInsights" must ONLY describe how the provided memories influenced THIS review.
  If no memory was provided or none was relevant, return an empty array. Never invent memories.
- "learnedInsights" are short, durable, third-person facts about the developer worth
  remembering for FUTURE reviews (recurring mistakes, coding preferences, advice given).
  Example: "The developer frequently forgets null validation on method parameters."
  Do not include code, and do not include one-off trivia. Return at most 3, or an empty array.

Respond with a single JSON object with exactly these keys:
summary (string), issues (array of {severity: HIGH|MEDIUM|LOW, title, explanation, suggestion}),
improvements (array of strings), memoryInsights (array of strings), learnedInsights (array of strings).`;

const str = { type: 'string' };
const REVIEW_SCHEMA = {
  type: 'object',
  properties: {
    summary: str,
    issues: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          severity: { type: 'string', enum: ['HIGH', 'MEDIUM', 'LOW'] },
          title: str,
          explanation: str,
          suggestion: str,
        },
        required: ['severity', 'title', 'explanation', 'suggestion'],
        additionalProperties: false,
      },
    },
    improvements: { type: 'array', items: str },
    memoryInsights: { type: 'array', items: str },
    learnedInsights: { type: 'array', items: str },
  },
  required: ['summary', 'issues', 'improvements', 'memoryInsights', 'learnedInsights'],
  additionalProperties: false,
};

let groq = null;
function getGroq() {
  if (!process.env.GROQ_API_KEY) throw new Error('GROQ_API_KEY is missing in .env');
  if (!groq) groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  return groq;
}

const strings = (v) => (Array.isArray(v) ? v.filter((x) => typeof x === 'string' && x.trim()) : []);

function normalize(raw) {
  const issues = Array.isArray(raw.issues) ? raw.issues : [];
  return {
    summary: typeof raw.summary === 'string' ? raw.summary : '',
    issues: issues.map((i) => ({
      severity: ['HIGH', 'MEDIUM', 'LOW'].includes(String(i.severity).toUpperCase())
        ? String(i.severity).toUpperCase()
        : 'MEDIUM',
      title: i.title || 'Issue',
      explanation: i.explanation || '',
      suggestion: i.suggestion || '',
    })),
    improvements: strings(raw.improvements),
    memoryInsights: strings(raw.memoryInsights),
    learnedInsights: strings(raw.learnedInsights),
  };
}

async function reviewCode(code, memories = []) {
  const memoryBlock = memories.length
    ? memories.map((m) => `- ${m}`).join('\n')
    : 'None yet. This is the first review for this developer.';

  const userMessage =
    `Previous memories about this developer:\n${memoryBlock}\n\n` +
    `Java code to review:\n<code>\n${code.slice(0, MAX_CODE_CHARS)}\n</code>`;

  const useSchema = STRICT_SCHEMA_MODELS.includes(MODEL);
  const responseFormat = useSchema
    ? { type: 'json_schema', json_schema: { name: 'java_code_review', strict: true, schema: REVIEW_SCHEMA } }
    : { type: 'json_object' };

  try {
    const completion = await getGroq().chat.completions.create({
      model: MODEL,
      temperature: 0.2,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      response_format: responseFormat,
    });
    const content = completion.choices?.[0]?.message?.content || '{}';
    return normalize(JSON.parse(content));
  } catch (err) {
    throw new Error(`Groq review failed: ${err.message}`);
  }
}

module.exports = { reviewCode, MODEL };
