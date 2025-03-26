import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Function to verify JWT token
async function verifyToken(token: string) {
  try {
    // Use the same secret as your backend
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname;

  // public paths that don't require authentication
  const isPublicPath = [
    "/",
    "/login",
    "/login/seller",
    "/login/buyer",
    "/signup",
    "/signup/seller",
    "/signup/buyer",
    "/forgot-password",
    "/reset-password",
  ].includes(path);

  // Define seller-only paths
  const isSellerPath = path.startsWith("/seller");

  // Define buyer-only paths
  const isBuyerPath = path.startsWith("/buyer");

  // Get token from cookies (more secure than localStorage)
  const token = request.cookies.get("token")?.value;

  // If no token and trying to access protected route, redirect to login
  if (!token && !isPublicPath) {
    console.log("redirecting to ");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If has token and trying to access login/signup pages, redirect to dashboard
  if (token && isPublicPath && path !== "/") {
    // Verify token and get user role
    const payload = await verifyToken(token);
    console.log("payload", payload);

    if (payload) {
      const role = payload.role as string;

      // Redirect to appropriate dashboard based on role
      if (role === "SELLER") {
        return NextResponse.redirect(new URL("/seller", request.url));
      } else if (role === "BUYER") {
        return NextResponse.redirect(new URL("/buyer", request.url));
      } else if (role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    }
  }

  // Check role-based access
  if (token) {
    const payload = await verifyToken(token);

    if (payload) {
      const role = payload.role as string;

      // Prevent sellers from accessing buyer routes
      if (role === "SELLER" && isBuyerPath) {
        return NextResponse.redirect(new URL("/seller", request.url));
      }

      // Prevent buyers from accessing seller routes
      if (role === "BUYER" && isSellerPath) {
        return NextResponse.redirect(new URL("/buyer", request.url));
      }
    }
  }

  return NextResponse.next();
}

// Configure which paths middleware will run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public assets)
     * - api routes (backend API)
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api).*)",
  ],
};
