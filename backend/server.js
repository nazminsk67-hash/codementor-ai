// Express server: serves the frontend and exposes POST /api/review.

const path = require("path");
const express = require("express");
const cors = require("cors");

require("dotenv").config({
  path: path.join(__dirname, "..", ".env")
});

const { recallMemories, retainInsights } = require("./hindsight");
const { reviewCode } = require("./agent");

const app = express();

const PORT = process.env.PORT || 3000;
const MAX_CODE_CHARS = 12000;
const JAVA_HINT =
  /\b(class|interface|enum|record|void|public|private|protected|static)\b/;

// CORS
app.use(cors());

// JSON body
app.use(express.json({ limit: "100kb" }));

// Serve frontend
app.use(express.static(path.join(__dirname, "..", "frontend")));

app.post("/api/review", async (req, res) => {
  // 1. Validate
  const code = req.body && req.body.code;

  if (typeof code !== "string" || !code.trim()) {
    return res.status(400).json({
      error: 'Please provide Java code in the "code" field.'
    });
  }

  if (code.length > MAX_CODE_CHARS) {
    return res.status(400).json({
      error: `Code is too long (max ${MAX_CODE_CHARS} characters).`
    });
  }

  if (!JAVA_HINT.test(code)) {
    return res.status(400).json({
      error: "That does not look like Java code."
    });
  }

  // 2. Recall memories
  const recalled = await recallMemories(code);

  // 3. Review with Groq
  let review;

  try {
    review = await reviewCode(code, recalled.memories);
  } catch (err) {
    console.error("[review]", err.message);

    return res.status(502).json({
      error: err.message
    });
  }

  // 4. Store new insights
  const retained = await retainInsights(review.learnedInsights);

  // 5. Respond
  const memoryAvailable =
    recalled.available && retained.available;

  res.json({
    review: review.summary,
    issues: review.issues,
    improvements: review.improvements,
    memoryInsights: review.memoryInsights,
    memoryUsed: recalled.memories.slice(0, 8),
    memoryLearned: retained.stored,

    memoryStatus: {
      available: memoryAvailable,

      message: memoryAvailable
        ? "Hindsight memory active"
        : "Memory is temporarily unavailable. The review was still generated."
    }
  });
});

// Bad JSON bodies
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      error: "Invalid JSON body."
    });
  }

  console.error(err);

  res.status(500).json({
    error: "Unexpected server error."
  });
});

// Start server
app.listen(PORT, () => {
  console.log(
    `CodeMentor AI running at http://localhost:${PORT}`
  );
});