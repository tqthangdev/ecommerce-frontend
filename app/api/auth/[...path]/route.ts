import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const pathArray = (await params).path;
    const pathStr = pathArray.join("/");
    const body = await request.json().catch(() => ({}));

    // 1. Forward incoming cookies from client to Spring Boot
    const clientCookie = request.headers.get("cookie") || "";

    // 2. Proxy request to Spring Boot Backend
    const springRes = await fetch(`${API_BASE_URL}/api/auth/${pathStr}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": clientCookie,
      },
      body: JSON.stringify(body),
    });

    const data = await springRes.json();

    if (!springRes.ok) {
      return NextResponse.json(data, { status: springRes.status });
    }

    // 3. Prepare response object for Next.js client
    const response = NextResponse.json(data);

    // 4. Extract and forward all Set-Cookie headers from Spring Boot response
    const setCookieHeaders = springRes.headers.getSetCookie 
      ? springRes.headers.getSetCookie() 
      : [springRes.headers.get("set-cookie")].filter(Boolean) as string[];

    if (setCookieHeaders.length > 0) {
      setCookieHeaders.forEach((cookieString) => {
        response.headers.append("Set-Cookie", cookieString);
      });
      console.log(`[PROXY /api/auth/${pathStr}] Successfully forwarded ${setCookieHeaders.length} cookies from Spring Boot.`);
    } else {
      console.log(`[PROXY /api/auth/${pathStr}] No Set-Cookie header received from Spring Boot.`);
    }

    return response;
  } catch (error) {
    console.error("Proxy Error:", error);
    return NextResponse.json(
      { success: false, message: "Proxy Connection Error" },
      { status: 500 }
    );
  }
}