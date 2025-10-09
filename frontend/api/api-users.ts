import api from "@/lib/axios";

/**
 * Gets user information including organization memberships
 * @param userId The Clerk user ID
 * @returns User data with organizations
 */
export async function getUserOrgs(userId: string) {
  const res = await api.get('/api/users', {
    headers: {
      'x-clerk-user-id': userId,
    }
  });
  return res.data;
}

/**
 * Gets user information with custom user ID
 * @param userId The Clerk user ID
 * @returns User data with organizations
 */
export async function getUserById(userId: string) {
  const res = await api.get('/api/users', {
    headers: {
      'x-clerk-user-id': userId,
    }
  });
  return res.data;
}