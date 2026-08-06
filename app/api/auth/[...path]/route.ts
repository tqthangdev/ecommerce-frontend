import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const pathArray = (await params).path;
    const pathStr = pathArray.join("/");
    const body = await request.json();

    const springRes = await fetch(`${API_BASE_URL}/api/auth/${pathStr}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await springRes.json();

    if (!springRes.ok) {
      return NextResponse.json(data, { status: springRes.status });
    }

    // 2. Tạo Response trả về cho Frontend
    const response = NextResponse.json(data);

    // 3. Lấy refreshToken từ response và Set Cookie chuẩn lên Domain Vercel
    const refreshToken = data?.data?.refreshToken || data?.refreshToken;

    if (refreshToken) {
      response.cookies.set("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 ngày
      });
    }

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Proxy Connection Error" },
      { status: 500 }
    );
  }
}