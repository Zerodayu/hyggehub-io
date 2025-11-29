
import { getAuth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';

/**
 * Checks user's organization status and enforces access rules.
 *
 * Usage: Call this function in API routes or page components to restrict access.
 *

 * @param req - NextRequest object
 * @returns Response | void
 */
export async function enforceOrgAccess(req: NextRequest): Promise<Response | void> {
	const { userId, orgId } = await getAuth(req);
	const pathname = req.nextUrl.pathname;

	// Not signed in
	if (!userId) {
		return Response.redirect(new URL('/sign-in', req.url));
	}

	if (orgId) {
		// User with org: allow /users and /shops
		if (pathname.startsWith('/users') || pathname.startsWith('/shops')) {
			return;
		}
		// Redirect to /users by default
		return Response.redirect(new URL('/users', req.url));
	} else {
		// User without org: only allow /users
		if (pathname.startsWith('/users')) {
			return;
		}
		return Response.redirect(new URL('/users', req.url));
	}
}
