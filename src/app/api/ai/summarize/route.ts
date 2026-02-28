import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import Groq from "groq-sdk";

const summarizeSchema = z.object({
  content: z.string().min(1, "Content is required"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = summarizeSchema.parse(body);

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({
        success: true,
        data: {
          summary:
            "AI summary generation requires a Groq API key. Please add your GROQ_API_KEY to the environment variables.",
        },
      });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `Generate a concise 2-3 sentence TLDR summary of the following blog post content. Make it informative and engaging: ${validated.content}`,
        },
      ],
      max_tokens: 150,
    });

    const summary = completion.choices[0]?.message?.content?.trim() || "";

    return NextResponse.json({ success: true, data: { summary } });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error },
        { status: 400 }
      );
    }
    console.error("Error generating summary:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}
