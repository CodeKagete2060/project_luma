const OpenAI = require("openai");

// Simple in-memory rate limiter per user (requests per minute)
const rateLimiters = new Map();

function rateLimit(userId, limit = 30) {
  const key = String(userId || "anon");
  const now = Date.now();
  const window = 60 * 1000;
  const info = rateLimiters.get(key) || { ts: now, count: 0 };
  if (now - info.ts > window) {
    info.ts = now;
    info.count = 0;
  }
  info.count += 1;
  rateLimiters.set(key, info);
  return info.count <= limit;
}

// ✅ Real OpenAI integration (fallbacks to mock if missing)
async function queryOpenAI({ question }) {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await client.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are an educational AI assistant for Project LUMA, helping students learn through step-by-step reasoning." },
      { role: "user", content: question },
    ],
  });

  const message = response.choices[0].message.content;
  return {
    answer: message,
    steps: ["Understand the question", "Analyze the problem", "Apply reasoning step-by-step"],
    hints: ["Think about key concepts", "Break the task down", "Check for logic consistency"],
    sources: [],
    meta: {
      provider: "openai",
      fallback: false,
    },
  };
}

// 🧪 Mock fallback for local testing
async function mockLLM({ question }, meta = {}) {
  const answer = `Mocked answer: Here's how to think about "${question}"`;
  const steps = [
    "Identify the key problem.",
    "Plan how to solve it.",
    "Apply each step carefully.",
  ];
  const hints = ["Draw it out", "Re-read instructions"];
  const sources = [];
  return { answer, steps, hints, sources, meta: { provider: meta.provider || "mock", fallback: meta.fallback || false, notice: meta.notice } };
}

module.exports = {
  rateLimit,
  async queryLLM(opts) {
    if (!rateLimit(opts.userId, Number(process.env.LLM_RATE_LIMIT || 30))) {
      const err = new Error("Rate limit exceeded");
      err.code = "RATE_LIMIT";
      throw err;
    }

    const provider = process.env.LLM_PROVIDER || "mock";

    try {
      if (provider === "openai" && process.env.OPENAI_API_KEY) {
        return await queryOpenAI(opts);
      }
      return await mockLLM(opts, {
        provider,
        fallback: provider !== "mock",
        notice: provider !== "mock" ? "Live AI unavailable, using study tips only." : undefined,
      });
    } catch (err) {
      console.error("LLM error:", err);
      return mockLLM(opts, {
        provider,
        fallback: true,
        notice: "Assistant is in offline mode. Response may be less detailed.",
      });
    }
  },
};
