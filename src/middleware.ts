import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/login',
  '/signup',
  '/forgot-password',
  '/',
  '/property',
  '/property/:path*',
  '/valuation',
  '/valuation/:path*',
]);

const isAuthRoute = createRouteMatcher([
  '/login',
  '/signup',
  '/forgot-password',
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // If user is authenticated and trying to access auth pages, redirect to home
  if (userId && isAuthRoute(req)) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // For non-public routes, protect if not authenticated
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
