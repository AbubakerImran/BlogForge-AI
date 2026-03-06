import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdminOrAbove } from "@/lib/permissions";
import { getSupabase, SUPPORT_BUCKET } from "@/lib/supabase";
import { randomUUID } from "crypto";

export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/", "video/"];

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    if (!isAdminOrAbove(session.user.role)) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: "File size must be less than 5MB" },
        { status: 400 }
      );
    }

    // Validate file type
    const isAllowed = ALLOWED_TYPES.some((type) =>
      file.type.startsWith(type)
    );
    if (!isAllowed) {
      return NextResponse.json(
        { success: false, error: "Only image and video files are allowed" },
        { status: 400 }
      );
    }

    // Derive extension from MIME type for safety
    const mimeExtMap: Record<string, string> = {
      "image/jpeg": "jpg", "image/png": "png", "image/gif": "gif",
      "image/webp": "webp", "image/svg+xml": "svg", "image/bmp": "bmp",
      "video/mp4": "mp4", "video/webm": "webm", "video/ogg": "ogg",
      "video/quicktime": "mov",
    };
    const ext = mimeExtMap[file.type] || file.name.split(".").pop() || "bin";
    const fileName = `${session.user.id}/${Date.now()}-${randomUUID()}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const supabase = getSupabase();
    const { error: uploadError } = await supabase.storage
      .from(SUPPORT_BUCKET)
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return NextResponse.json(
        { success: false, error: "Failed to upload file" },
        { status: 500 }
      );
    }

    const { data: urlData } = supabase.storage
      .from(SUPPORT_BUCKET)
      .getPublicUrl(fileName);

    return NextResponse.json({
      success: true,
      data: { url: urlData.publicUrl },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
