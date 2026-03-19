import { NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";
import { generateAIContent } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: "URL is required" }, { status: 400 });

    // Handle YouTube Shorts URLs
    let videoUrl = url;
    if (url.includes("/shorts/")) {
      const match = url.match(/\/shorts\/([^?]+)/);
      if (match && match[1]) {
        videoUrl = `https://www.youtube.com/watch?v=${match[1]}`;
      }
    }

    // Fetch Transcript
    const transcriptArray = await YoutubeTranscript.fetchTranscript(videoUrl);
    const fullText = transcriptArray.map((t) => t.text).join(" ");

    // Summarize with AI
    const prompt = `Please summarize the following YouTube video transcript. Provide a concise overview, key takeaways as bullet points, and a final conclusion.
    Transcript: ${fullText.substring(0, 15000)} // Limit to fit context
    Return the response as a JSON string with keys: overview, bulletPoints (array), and conclusion.`;

    const aiResponse = await generateAIContent(prompt, "You are an expert content summarizer.");
    
    let parsedContent;
    try {
        parsedContent = JSON.parse(aiResponse);
    } catch (e) {
        parsedContent = { overview: aiResponse, bulletPoints: [], conclusion: "" };
    }

    return NextResponse.json({ success: true, summary: parsedContent });
  } catch (error: any) {
    console.error("YouTube Summarizer Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
