import api from "@/lib/axios";

export async function getOrg(clerkOrgId: string) {
  const res = await api.get(`/api/orgs?clerkOrgId=${clerkOrgId}`);
  return res.data;
}

export async function updateOrgPhoneNo({ orgId, userId, phoneNo }: { orgId: string, userId: string, phoneNo: string }) {
  const res = await api.put('/api/orgs',
    { phoneNo },
    {
      headers: {
        'x-clerk-user-id': userId,
        'x-clerk-org-id': orgId,
      }
    }
  );
  return res.data;
}