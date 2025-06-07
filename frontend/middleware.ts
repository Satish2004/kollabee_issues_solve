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

  // console.log("middleware path", path);

  // public paths that don't require authentication
  const isPublicPath = [
    "/",
    "/test",
    "/contact",
    "/privacy-policy",
    "/terms-conditions",
    "/google",
    "/login",
    "/login/seller",
    "/login/buyer",
    "/login/admin",
    "/signup",
    "/signup/seller",
    "/signup/buyer",
    "/forgot-password",
    "/reset-password",
  ].includes(path);

  // Define seller-only paths
  const isSellerPath = path.startsWith("/seller");
  const isAdminPath = path.startsWith("/admin");

  // Define buyer-only paths
  const isBuyerPath = path.startsWith("/buyer");
  // const isAdminPath = path.startsWith("/admin");

  // Get token from cookies (more secure than localStorage)
  const token = request.cookies.get("token")?.value;

  // If no token and trying to access protected route, redirect to login
  if (!token && !isPublicPath) {
    // console.log("redirecting to ");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const common = ["/", "/terms-conditions", "/privacy-policy"];

  // If has token and trying to access login/signup pages, redirect to dashboard
  if (token && isPublicPath && !common.includes(path)) {
    // Verify token and get user role
    const payload = await verifyToken(token);
    // console.log("payload", payload);

    if (payload) {
      const role = payload.role as string;
      // console.log("here testing role", role);

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

      // console.log("protected path", role);

      // Prevent sellers from accessing buyers & admin routes
      if (role === "SELLER" && (isBuyerPath || isAdminPath)) {
        return NextResponse.redirect(new URL("/seller", request.url));
      }

      // Prevent buyers from accessing seller & admin routes
      if (role === "BUYER" && (isSellerPath || isAdminPath)) {
        return NextResponse.redirect(new URL("/buyer", request.url));
      }

      // Prevent admin from accessing seller & buyer routes
      if (role === "ADMIN" && (isSellerPath || isBuyerPath)) {
        return NextResponse.redirect(new URL("/admin", request.url));
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
