import { NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";
import { generateAIContent } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: "URL is required" }, { status: 400 });

    // Robust Video ID Extraction
    const videoIdMatch = url.match(/(?:v=|\/|shorts\/)([0-9A-Za-z_-]{11})/);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;

    if (!videoId) {
      return NextResponse.json({ success: false, error: "Invalid YouTube URL format" }, { status: 400 });
    }

    async function fetchFromInnerTube(client: string, version: string) {
        const response = await fetch("https://www.youtube.com/youtubei/v1/player?prettyPrint=false", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "User-Agent": client === "IOS" 
                    ? "com.google.ios.youtube/19.29.1 (iPhone16,2; U; CPU iOS 17_5_1 like Mac OS X; en_US)"
                    : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
                "X-Goog-Api-Format-Version": "2",
            },
            body: JSON.stringify({
                context: {
                    client: {
                        clientName: client,
                        clientVersion: version,
                    },
                },
                videoId: videoId,
            }),
        });
        return response.json();
    }

    console.log(`Attempting Multi-Client InnerTube Fetch for: ${videoId}`);
    
    // Try IOS first, then WEB_REMIX as fallback
    let playerResponse = await fetchFromInnerTube("IOS", "19.29.1");
    let captionTracks = playerResponse?.captions?.playerCaptionsTracklistRenderer?.captionTracks;

    if (!captionTracks || captionTracks.length === 0) {
        console.log("IOS Blocked, trying WEB_REMIX...");
        playerResponse = await fetchFromInnerTube("WEB_REMIX", "1.20240722.01.00");
        captionTracks = playerResponse?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
    }

    if (!captionTracks || captionTracks.length === 0) {
        const status = playerResponse?.playabilityStatus?.status || "UNKNOWN";
        const reason = playerResponse?.playabilityStatus?.reason || "No specific reason provided";
        return NextResponse.json({ 
            success: false, 
            error: `YouTube Blocked Vercel. Status: ${status}. Reason: ${reason}. Please try on Localhost!`,
            debug: status 
        }, { status: 403 });
    }

    // Use the first available track (usually English)
    const transcriptUrl = captionTracks[0].baseUrl;
    const transcriptResponse = await fetch(transcriptUrl);
    const transcriptXml = await transcriptResponse.text();

    // Simple XML to Text parser
    const fullText = transcriptXml
        .match(/<text[^>]*>([\s\S]*?)<\/text>/g)
        ?.map(t => t.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'"))
        .join(" ") || "";

    if (!fullText) {
        return NextResponse.json({ success: false, error: "Failed to parse transcript content" }, { status: 500 });
    }

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
