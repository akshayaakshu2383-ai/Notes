import { NextResponse } from "next/server";
import { generateAIContent } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { type, data } = await req.json();

    let prompt = "";
    if (type === "resume") {
      prompt = `Generate a professional resume content for the following details. Include a professional summary, bullet points for experience, and highlight key skills.
      Details: ${JSON.stringify(data)}
      Return the response in a structured format (JSON string) with keys: summary, experience (array of objects with role, company, duration, and bulletPoints), and skills.`;
    } else if (type === "skills") {
      prompt = `Suggest a list of 10-15 professional skills (technical and soft) for the job title: "${data.role}". 
      Return the response as a JSON array of strings: ["Skill 1", "Skill 2", ...]. Only return the JSON.`;
    }

    const aiResponse = await generateAIContent(prompt);
    
    // Attempt to parse JSON if AI returned it, otherwise return as text
    let parsedContent;
    try {
        parsedContent = JSON.parse(aiResponse);
    } catch (e) {
        parsedContent = { rawText: aiResponse };
    }

    return NextResponse.json({ success: true, content: parsedContent });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
