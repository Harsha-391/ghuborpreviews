import { NextResponse } from "next/server";
import { verifyAdminRequest } from "../../../../utils/verifyAdmin";

export async function POST(request: Request) {
  try {
    if (!(await verifyAdminRequest(request))) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json();
    const { paymentId, amount, notes } = body;

    if (!paymentId) {
      return NextResponse.json({ error: "paymentId is required." }, { status: 400 });
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json({ error: "Razorpay API keys are not configured." }, { status: 400 });
    }

    const authString = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

    // amount is in paise. Omitting it issues a full refund of the remaining captured amount.
    const payload: Record<string, unknown> = {};
    if (typeof amount === "number" && amount > 0) {
      payload.amount = Math.round(amount);
    }
    if (notes && typeof notes === "object") {
      payload.notes = notes;
    }

    const response = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}/refund`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${authString}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Razorpay refund API error:", data);
      const errorMsg = data?.error?.description || "Razorpay refund request failed.";
      return NextResponse.json({ error: errorMsg, details: data }, { status: response.status });
    }

    return NextResponse.json({ success: true, refund: data });
  } catch (error: any) {
    console.error("Razorpay refund route handler exception:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
