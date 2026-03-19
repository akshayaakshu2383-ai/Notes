import axios from 'axios';

export async function generateAIContent(prompt: string, systemPrompt: string = "You are a professional resume writer and career coach.") {
  const apiKey = process.env.AI_API_KEY;
  const baseUrl = "https://api.groq.com/openai/v1/chat/completions"; // Defaulting to Groq

  try {
    const response = await axios.post(
      baseUrl,
      {
        model: process.env.AI_MODEL || "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error: any) {
    console.error("AI Generation Error:", error.response?.data || error.message);
    throw new Error("Failed to generate AI content");
  }
}
