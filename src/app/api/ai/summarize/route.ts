import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import OpenAI from "openai";

const summarizeSchema = z.object({
  content: z.string().min(1, "Content is required"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = summarizeSchema.parse(body);

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        success: true,
        data: {
          summary:
            "AI summary generation requires an OpenAI API key. Please add your OPENAI_API_KEY to the environment variables.",
        },
      });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
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
