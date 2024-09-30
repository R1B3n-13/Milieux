import { NextRequest, NextResponse } from "next/server";
import { getUserFromAuthToken } from "./services/userService";

export async function middleware(request: NextRequest) {
  const user = await getUserFromAuthToken();
  const currentPath = request.nextUrl.pathname;

  const protectedRoutes = [
    "/stream",
    "/persona",
    "/businesses",
    "/followings",
    "/followers",
    "/search",
    "/bookmarks",
    "/chat",
    "/flashes",
    "/communities",
    "/videos",
    "/lists",
    "/memories",
    "/gaming",
    "/kids",
    "/ecomm",
    "/chappy",
  ];

  const isProtectedRoute = protectedRoutes.some((route) =>
    currentPath.startsWith(route)
  );

  if (currentPath === "/") {
    return NextResponse.redirect(new URL("/stream", request.url));
  }

  if (isProtectedRoute && user.success === false) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
