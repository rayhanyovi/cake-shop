import { NextResponse, type NextRequest } from "next/server";

const apiBaseUrl = process.env.API_BASE_URL;
const authCookieName = "accessToken";

export async function POST(request: NextRequest) {
  if (!apiBaseUrl) {
    return NextResponse.json(
      { success: false, message: "API base URL is not configured." },
      { status: 500 }
    );
  }

  const payload = await request.json();
  const headers = new Headers({ "Content-Type": "application/json" });
  const cookie = request.headers.get("cookie");
  const auth = request.headers.get("authorization");
  if (cookie) headers.set("cookie", cookie);
  if (auth) headers.set("authorization", auth);

  const response = await fetch(`${apiBaseUrl}/login`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  const proxyHeaders = new Headers();
  const setCookie = response.headers.get("set-cookie");
  if (setCookie) proxyHeaders.set("set-cookie", setCookie);

  const responseBody = { status: response.status, ...data };
  const nextResponse = NextResponse.json(responseBody, {
    status: response.status,
    headers: proxyHeaders,
  });

  const token =
    typeof data?.accessToken === "string"
      ? data.accessToken
      : typeof data?.data?.accessToken === "string"
      ? data.data.accessToken
      : null;
  const expiresAt =
    typeof data?.expiresAt === "string"
      ? data.expiresAt
      : typeof data?.data?.expiresAt === "string"
      ? data.data.expiresAt
      : null;

  if (token) {
    const cookieOptions: Parameters<typeof nextResponse.cookies.set>[1] = {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    };

    if (expiresAt) {
      const expiresDate = new Date(expiresAt);
      if (!Number.isNaN(expiresDate.valueOf())) {
        cookieOptions.expires = expiresDate;
      }
    }

    nextResponse.cookies.set(authCookieName, token, cookieOptions);
  }

  console.log("Login proxy response:", { status: response.status, data });

  return nextResponse;
}
