
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/'])

export default clerkMiddleware(async (auth, req) => {
  const session = await auth();
  const userId = session.userId;
  const orgId = session.orgId;

  // If user is not signed in
  if (!userId) {
    if (isPublicRoute(req)) {
      return;
    }
    return Response.redirect(new URL('/sign-in', req.url));
  }

    // Scan personal account for organization membership via API
    let userHasOrg = false;
    try {
      const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://coffee-shop-app-ruddy.vercel.app'}/api/users?clerkId=${userId}`, {
        headers: { 'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '' },
      });
      if (apiRes.ok) {
        const data = await apiRes.json();
        userHasOrg = Array.isArray(data.followedShops) && data.followedShops.length > 0;
      }
    } catch (e) {
      userHasOrg = false;
    }

  // If user is signed in, prevent access to / and /sign-in
  if (isPublicRoute(req)) {
    if (userHasOrg) {
      return Response.redirect(new URL('/shops', req.url));
    }
    return Response.redirect(new URL('/users', req.url));
  }

  // Strictly enforce allowed sections
  if (userHasOrg) {
    const allowed = req.nextUrl.pathname.startsWith('/shops') || req.nextUrl.pathname.startsWith('/users');
    if (!allowed) {
      return Response.redirect(new URL('/users', req.url));
    }
    return;
  } else {
    if (!req.nextUrl.pathname.startsWith('/users')) {
      return Response.redirect(new URL('/users', req.url));
    }
    return;
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