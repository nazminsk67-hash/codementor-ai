// Thin wrapper around the official Hindsight Cloud SDK (@vectorize-io/hindsight-client).
// Two jobs: recallMemories() before a review, retainInsights() after a review.
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const BASE_URL = process.env.HINDSIGHT_BASE_URL || 'https://api.hindsight.vectorize.io';
const API_KEY = process.env.HINDSIGHT_API_KEY;
const BANK_ID = process.env.HINDSIGHT_BANK_ID || 'codementor-demo-dev';

let clientPromise = null;
let bankReady = false;

// Dynamic import works whether the SDK ships as ESM or CommonJS.
async function getClient() {
  if (!API_KEY) throw new Error('HINDSIGHT_API_KEY is missing in .env');
  if (!clientPromise) {
    clientPromise = import('@vectorize-io/hindsight-client').then(
      ({ HindsightClient }) => new HindsightClient({ baseUrl: BASE_URL, apiKey: API_KEY })
    );
  }
  return clientPromise;
}

// One bank = one developer identity, shared by every review request.
async function ensureBank(client) {
  if (bankReady) return;
  try {
    await client.createBank(BANK_ID, {
      name: 'CodeMentor AI Developer Memory',
      mission:
        "Track a Java developer's recurring coding mistakes, coding preferences and previous " +
        'code review feedback so future reviews can be personalized.',
    });
  } catch (err) {
    // Usually "already exists". If it is a real problem, retain/recall will surface it.
    console.warn('[hindsight] createBank skipped:', err.message);
  }
  bankReady = true;
}

// Retrieve memories relevant to the code about to be reviewed.
async function recallMemories(code) {
  try {
    const client = await getClient();
    await ensureBank(client);
    const query =
      'What recurring Java mistakes, coding preferences and previous review feedback ' +
      'does this developer have that are relevant to this code?\n' +
      code.slice(0, 500);
    const res = await client.recall(BANK_ID, query, { budget: 'mid', maxTokens: 2048 });
    const memories = (res.results || []).map((r) => r.text).filter(Boolean);
    return { available: true, memories };
  } catch (err) {
    console.error('[hindsight] recall failed:', err.message);
    return { available: false, memories: [], error: err.message };
  }
}

// Store long-term insights extracted from a review (short strings, not raw code).
async function retainInsights(insights) {
  const items = (insights || [])
    .filter((s) => typeof s === 'string' && s.trim())
    .map((s) => ({
      content: s.trim(),
      context: 'Java code review insight about this developer',
    }));
  if (items.length === 0) return { available: true, stored: [] };

  try {
    const client = await getClient();
    await ensureBank(client);
    await client.retainBatch(BANK_ID, items, { async: false });
    return { available: true, stored: items.map((i) => i.content) };
  } catch (err) {
    console.error('[hindsight] retain failed:', err.message);
    return { available: false, stored: [], error: err.message };
  }
}

module.exports = { recallMemories, retainInsights, BANK_ID };
