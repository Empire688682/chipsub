import { NextResponse } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(req) {
  const path = req.nextUrl.pathname  
  const token = req.cookies.get("UserToken")?.value || "";
  const protectedPaths = [
    "/blog",
    "/buy-data",
    "/contact",
    "/dashbord",
    "/fund-wallet",
    "/api-docs"
  ];
  const isProtected = protectedPaths.some((protectedPath)=>
   path.startsWith(protectedPath));

  if(!token && isProtected){
    return NextResponse.redirect(new URL('/', req.url));
  }
  
}
 
export const config = {
  matcher: [
    "/",
    "/blog",
    "/buy-data",
    "/contact",
    "/dashbord",
    "/fund-wallet",
    "/api-docs",
  ],
}