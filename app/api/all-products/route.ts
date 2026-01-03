import { NextResponse, type NextRequest } from "next/server";

const apiBaseUrl = process.env.API_BASE_URL;

export async function GET(_request: NextRequest) {
  if (!apiBaseUrl) {
    return NextResponse.json(
      { success: false, message: "API base URL is not configured." },
      { status: 500 }
    );
  }

  console.log("All-products proxy request");

  const response = await fetch(`${apiBaseUrl}/all-products`, {
    method: "GET",
  });

  const data = await response.json();
  const proxyHeaders = new Headers();
  const setCookie = response.headers.get("set-cookie");
  if (setCookie) proxyHeaders.set("set-cookie", setCookie);

  console.log("All-products proxy response:", {
    status: response.status,
    count: Array.isArray(data?.data) ? data.data.length : 0,
  });

  return NextResponse.json(data, {
    status: response.status,
    headers: proxyHeaders,
  });
}
