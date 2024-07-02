import { NextRequest, NextResponse } from "next/server";
import { getUserFromAuthToken } from "./actions/userActions";

export async function middleware(request: NextRequest) {
  const user = await getUserFromAuthToken();

  const currentPath = request.nextUrl.pathname;

  if (currentPath.startsWith("/stream") && user.ok === false) {
    const url = new URL("/login", request.url);
    return NextResponse.redirect(url, 302);
  }

  return NextResponse.next();
}

// export const config = {
//   matcher: ["/((?!login|register).*)"],
// };
