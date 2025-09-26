
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/'])

export default clerkMiddleware(async (auth, req) => {
  const session = await auth();
  const userId = session.userId;
  const orgId = session.orgId;

  // If user is not signed in
  if (!userId) {
    // Only allow / and /sign-in
    if (isPublicRoute(req)) {
      return;
    }
    return Response.redirect(new URL('/sign-in', req.url));
  }

  // If user is signed in, prevent access to / and /sign-in
  if (isPublicRoute(req)) {
    // If user has organization, redirect to /shops
    if (orgId) {
      return Response.redirect(new URL('/shops', req.url));
    }
    // If user does not have organization, redirect to /users
    return Response.redirect(new URL('/users', req.url));
  }

  // If user has organization, redirect to /shops if not already there
  if (orgId) {
    if (!req.nextUrl.pathname.startsWith('/shops')) {
      return Response.redirect(new URL('/shops', req.url));
    }
    return;
  }

  // If user does not have organization, redirect to /users if not already there
  if (!req.nextUrl.pathname.startsWith('/users')) {
    return Response.redirect(new URL('/users', req.url));
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}