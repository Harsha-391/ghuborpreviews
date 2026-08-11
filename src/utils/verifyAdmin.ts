/**
 * Server-only helper: confirms a request carries a valid Firebase ID token
 * for the Ghubor admin account, without needing the Firebase Admin SDK
 * (verifies via Google's public accounts:lookup REST endpoint instead).
 * Use this to gate any API route that performs a sensitive, real-world
 * action (refunds, shipments, etc.) on the admin's behalf.
 */
const ADMIN_EMAIL = "ghuborsupport@gmail.com";

export async function verifyAdminRequest(request: Request): Promise<boolean> {
  const authHeader = request.headers.get("authorization") || "";
  const idToken = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!idToken) return false;

  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) return false;

  try {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      }
    );
    if (!res.ok) return false;
    const data = await res.json();
    const email = data?.users?.[0]?.email;
    return email === ADMIN_EMAIL;
  } catch {
    return false;
  }
}
