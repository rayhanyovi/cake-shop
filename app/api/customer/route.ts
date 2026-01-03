import { NextResponse, type NextRequest } from "next/server";

const apiBaseUrl = process.env.API_BASE_URL;
const authCookieName = "accessToken";

export async function GET(request: NextRequest) {
  if (!apiBaseUrl) {
    return NextResponse.json(
      { success: false, message: "API base URL is not configured." },
      { status: 500 },
    );
  }

  const headers = new Headers();
  const auth = request.headers.get("authorization");
  const token = request.cookies.get(authCookieName)?.value;
  if (auth) headers.set("authorization", auth);
  if (!auth && token) headers.set("authorization", token);

  const response = await fetch(`${apiBaseUrl}/customer`, {
    method: "GET",
    headers,
  });

  const data = await response.json();
  const proxyHeaders = new Headers();
  const setCookie = response.headers.get("set-cookie");
  if (setCookie) proxyHeaders.set("set-cookie", setCookie);

  return NextResponse.json(data, {
    status: response.status,
    headers: proxyHeaders,
  });
}
