import { NextResponse } from "next/server";
import { msg } from "@/lib/messages";

// Safe fallback for Backend URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const pathArray = (await params).path;
    const pathStr = pathArray.join("/");
    
    // Parse body an toan
    const body = await request.json().catch(() => ({}));

    // 1. Forward incoming cookies from client to Spring Boot
    const clientCookie = request.headers.get("cookie") || "";

    // Target URL
    const targetUrl = `${API_BASE_URL.replace(/\/$/, "")}/api/auth/${pathStr}`;

    // 2. Proxy request to Spring Boot Backend
    const springRes = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": clientCookie,
      },
      body: JSON.stringify(body),
    });

    const data = await springRes.json().catch(() => ({}));

    if (!springRes.ok) {
      return NextResponse.json(data, { status: springRes.status });
    }

    // 3. Prepare response object for Next.js client
    const response = NextResponse.json(data);

    // 4. Safely extract Set-Cookie headers from Spring Boot response
    try {
      let cookiesToForward: string[] = [];

      if (typeof springRes.headers.getSetCookie === "function") {
        cookiesToForward = springRes.headers.getSetCookie();
      } else {
        const rawCookie = springRes.headers.get("set-cookie");
        if (rawCookie) {
          cookiesToForward = [rawCookie];
        }
      }

      cookiesToForward.forEach((cookieString) => {
        response.headers.append("Set-Cookie", cookieString);
      });
    } catch (cookieError) {
      console.error("Error forwarding cookies:", cookieError);
    }

    return response;
  } catch (error: any) {
    console.error("Proxy Error Details:", error);
    return NextResponse.json(
      {
        success: false,
        message: msg.proxyConnectionError,
        error: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}