import { NextResponse } from "next/server";

export function GET(req) {
  const res = NextResponse.redirect(new URL("/", req.url));
  res.cookies.delete("UserToken", { path: "/" });
  return res;
}
