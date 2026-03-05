import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdminOrAbove } from "@/lib/permissions";

export const dynamic = "force-dynamic";

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

    const body = await request.json();
    const { url, type = "URL_UPDATED" } = body;

    if (!url) {
      return NextResponse.json(
        { success: false, error: "URL is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_INDEXING_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Google Indexing API is not configured. Please set the GOOGLE_INDEXING_API_KEY environment variable with your service account JSON.",
        },
        { status: 500 }
      );
    }

    // Parse the service account credentials
    let credentials;
    try {
      credentials = JSON.parse(apiKey);
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid Google Indexing API key format. Must be valid JSON." },
        { status: 500 }
      );
    }

    // Create JWT for Google API authentication
    const jwt = await createGoogleJWT(credentials);

    // Call Google Indexing API
    const response = await fetch(
      "https://indexing.googleapis.com/v3/urlNotifications:publish",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          type,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: result.error?.message || "Failed to submit URL for indexing",
          details: result,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        url: result.urlNotificationMetadata?.url || url,
        type,
        notifyTime: result.urlNotificationMetadata?.latestUpdate?.notifyTime,
      },
    });
  } catch (error) {
    console.error("Error submitting URL for indexing:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit URL for indexing" },
      { status: 500 }
    );
  }
}

async function createGoogleJWT(credentials: {
  client_email: string;
  private_key: string;
}): Promise<string> {
  const header = {
    alg: "RS256",
    typ: "JWT",
  };

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: credentials.client_email,
    scope: "https://www.googleapis.com/auth/indexing",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };

  const encodedHeader = Buffer.from(JSON.stringify(header)).toString("base64url");
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signatureInput = `${encodedHeader}.${encodedPayload}`;

  // Import private key and sign
  const crypto = await import("crypto");
  const sign = crypto.createSign("RSA-SHA256");
  sign.update(signatureInput);
  const signature = sign.sign(credentials.private_key, "base64url");

  const jwt = `${signatureInput}.${signature}`;

  // Exchange JWT for access token
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  const tokenData = await tokenResponse.json();
  if (!tokenResponse.ok) {
    throw new Error(tokenData.error_description || "Failed to get access token");
  }

  return tokenData.access_token;
}
