import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const trackingNumber = searchParams.get("trackingNumber");
    
    // Optional credential overrides sent from front-end
    const apiKey = searchParams.get("apiKey") || process.env.DHL_API_KEY;
    const apiSecret = searchParams.get("apiSecret") || process.env.DHL_API_SECRET;
    const isProduction = searchParams.get("isProduction") === "true" || (process.env.DHL_IS_PRODUCTION === "true");

    if (!trackingNumber) {
      return NextResponse.json({ error: "trackingNumber query parameter is required." }, { status: 400 });
    }

    if (!apiKey || !apiSecret) {
      return NextResponse.json({ error: "DHL API credentials are not configured." }, { status: 400 });
    }

    // Set base URL based on sandbox/production environment
    const baseUrl = isProduction
      ? "https://express.api.dhl.com/mydhlapi"
      : "https://express.api.dhl.com/mydhlapi/test";

    // Basic Authentication encoding
    const authString = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");

    // Make API request for tracking
    const response = await fetch(`${baseUrl}/shipments/${trackingNumber}/tracking?trackingView=all-checkpoints`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Authorization": `Basic ${authString}`,
        "DHL-API-Key": apiKey
      }
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("DHL Tracking API Error Response:", data);
      const errorMsg = data.detail || data.message || "DHL API Tracking request failed.";
      return NextResponse.json({ error: errorMsg, details: data }, { status: response.status });
    }

    return NextResponse.json({
      success: true,
      trackingData: data
    });

  } catch (error: any) {
    console.error("DHL tracking route handler exception:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
