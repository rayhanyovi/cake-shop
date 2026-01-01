import { NextResponse, type NextRequest } from "next/server";

const apiBaseUrl = process.env.API_BASE_URL;

export async function POST(request: NextRequest) {
  try {
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

    const response = await fetch(`${apiBaseUrl}/register`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    const proxyHeaders = new Headers();
    const setCookie = response.headers.get("set-cookie");
    if (setCookie) proxyHeaders.set("set-cookie", setCookie);

    return NextResponse.json(data, {
      status: response.status,
      headers: proxyHeaders,
    });
  } catch (error) {
    console.error("Register proxy failed:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Register proxy failed.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
