import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch site settings" },
      { status: 500 }
    );
  }
}
