import { NextResponse } from "next/server";
import { verifyAuth } from "@/app/lib/auth";

export async function middleware(request) {
  console.log("Middleware triggered");

  const token = request.cookies.get("authToken");
  const auth = token ? await verifyAuth(token) : null;

  if (auth) {
    const response = NextResponse.next();
    response.headers.set("x-user-id", auth.id);
    return response;
  } else {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: "/api/claims/:path*",
};
