const express = require("express");
const router = express.Router();
const axios = require("axios");
const History = require("../models/History");


// ROUTE 1: POST /api/ask-ai

const FREE_MODELS = [
  "deepseek/deepseek-r1:free",
  "google/gemma-3-4b-it:free",
  "mistralai/mistral-small-3.1-24b-instruct:free",
  "qwen/qwen2.5-vl-3b-instruct:free",
];

router.post("/ask-ai", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Please provide a prompt." });
  }

  let lastError = null;

//try each model in order until one works

  for (const model of FREE_MODELS) {
    try {
      console.log(`Trying model: ${model}`);
      const aiResponse = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model,
          messages: [{ role: "user", content: prompt }],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const answer = aiResponse.data.choices[0].message.content;
      console.log(`Success with model: ${model}`);

      return res.json({ response: answer });

    } catch (error) {
      const status = error.response?.status;
      console.warn(`Model ${model} failed with status ${status}. Trying next...`);
      lastError = error;

      if (status !== 429 && status !== 404) break;
    }
  }

  console.error("All models failed. Last error:", lastError?.message);
  if (lastError?.response) {
    console.error("Last response data:", JSON.stringify(lastError.response.data, null, 2));
  }
  res.status(500).json({ error: "All AI models are currently unavailable. Please try again shortly." });
});

// ROUTE 2: POST /api/save

router.post("/save", async (req, res) => {
  const { prompt, response } = req.body;
  if (!prompt || !response) {
    return res.status(400).json({ error: "Both prompt and response are required." });
  }

  try {
    const newEntry = new History({ prompt, response });

    await newEntry.save();

    res.json({ success: true, message: "Saved to database!" });

  } catch (error) {
    console.error("MongoDB Save Error:", error.message);
    res.status(500).json({ error: "Failed to save to database." });
  }
});

module.exports = router;
