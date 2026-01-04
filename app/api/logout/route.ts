import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  const response = NextResponse.json({ ok: true });

  cookieStore.getAll().forEach((cookie) => {
    response.cookies.set(cookie.name, "", {
      path: "/",
      maxAge: 0,
    });
  });

  return response;
}
