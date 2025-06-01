import { NextResponse } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(req) {
  const path = req.nextUrl.pathname  
  const token = req.cookies.get("UserToken")?.value || "";
  const protectedPaths = [
    "/blog",
    "/buy-data",
    "/contact",
    "/dashboard",
    "/dashboard/buy-data",
    "/dashboard/buy-airtime",
    "/dashboard/buy-electricity",
    "/dashboard/gift-card/buy",
    "/dashboard/gift-card/sell",
    "/dashboard/gift-card",
    "/dashboard/crypto/buy",
    "/dashboard/crypto/sell",
    "/dashboard/crypto",
    "/fund-wallet",
    "/api-docs",
    "/profile",
    "/notifications",
    "/payment-success",
  ];
  const isProtected = protectedPaths.some((protectedPath)=>
   path.startsWith(protectedPath));

  if(!token && isProtected){
    return NextResponse.redirect(new URL('/', req.url));
  }

  if(token && (path === "/" || path === "" || path === "/auth/callback" || "/reset-password")){
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
  
}
 
export const config = {
  matcher: [
    "/",
    "/blog",
    "/buy-data",
    "/contact",
    "/dashboard",
    "/dashboard/buy-data",
    "/dashboard/buy-airtime",
    "/dashboard/buy-electricity",
    "/dashboard/gift-card/buy",
    "/dashboard/gift-card/sell",
    "/dashboard/gift-card",
    "/dashboard/crypto/buy",
    "/dashboard/crypto/sell",
    "/dashboard/crypto",
    "/fund-wallet",
    "/api-docs",
    "/profile",
    "/notifications",
    "/payment-success",
    "/auth/callback",
    "/reset-password"
  ],
}