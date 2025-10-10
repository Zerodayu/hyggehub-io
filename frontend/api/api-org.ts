import api from "@/lib/axios";

export async function getOrg(clerkOrgId: string) {
  const res = await api.get('/api/orgs', {
    headers: {
      'x-clerk-org-id': clerkOrgId
    }
  });
  // Return the complete response which includes shop and connectedCustomers
  return res.data;
}

// Create a new function specifically for customers if you need more granular control
export async function getOrgCustomers(clerkOrgId: string) {
  const res = await api.get('/api/orgs', {
    headers: {
      'x-clerk-org-id': clerkOrgId
    }
  });
  // Return only the customers part of the response
  return res.data.connectedCustomers || [];
}

export async function updateOrgPhoneNo({ orgId, userId, phoneNo, shopCode,  }: { orgId: string, userId: string, phoneNo: string, shopCode: string }) {
  const res = await api.put('/api/orgs',
    { phoneNo, shopCode },
    {
      headers: {
        'x-clerk-user-id': userId,
        'x-clerk-org-id': orgId,
      }
    }
  );
  return res.data;
}