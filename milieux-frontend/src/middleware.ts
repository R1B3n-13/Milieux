import { NextRequest, NextResponse } from "next/server";
import { getUserFromAuthToken } from "./actions/userActions";

export async function middleware(request: NextRequest) {
  const user = await getUserFromAuthToken();

  const currentPath = request.nextUrl.pathname;

  if (currentPath.startsWith("/stream") && user.success === false) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
