import { NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";
import { generateAIContent } from "@/lib/ai";

export async function POST(req: Request) {
    try {
        const { url } = await req.json();
        if (!url) {
            return NextResponse.json({ error: "URL is required" }, { status: 400 });
        }

        // Extract Video ID
        const videoIdMatch = url.match(/(?:v=|\/|shorts\/)([0-9A-Za-z_-]{11})/);
        const videoId = videoIdMatch ? videoIdMatch[1] : null;

        if (!videoId) {
            return NextResponse.json(
                { success: false, error: "Invalid YouTube URL format" },
                { status: 400 }
            );
        }

        //  Fetch transcript (FIXED METHOD)
        const transcript = await YoutubeTranscript.fetchTranscript(videoId);

        const fullText = transcript.map((t: any) => t.text).join(" ");

        if (!fullText) {
            return NextResponse.json(
                { success: false, error: "No transcript available for this video" },
                { status: 500 }
            );
        }

        //  AI Summary
        const prompt = `Please summarize the following YouTube video transcript. Provide:
    1. A short overview
    2. Key points as bullet points
    3. A conclusion

    Transcript:
    ${fullText.substring(0, 15000)}

    Return response in JSON format with keys:
    overview, bulletPoints, conclusion.`;

        const aiResponse = await generateAIContent(
            prompt,
            "You are an expert content summarizer."
        );

        let parsedContent;
        try {
            parsedContent = JSON.parse(aiResponse);
        } catch {
            parsedContent = {
                overview: aiResponse,
                bulletPoints: [],
                conclusion: "",
            };
        }

        return NextResponse.json({ success: true, summary: parsedContent });

    } catch (error: any) {
        console.error("Error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to process video. Try another one." },
            { status: 500 }
        );
    }
}
