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

export async function delCustomer({ orgId, customerId }: { orgId: string, customerId: string }) {
  const res = await api.delete(`/api/orgs`, {
    headers: {
      'x-clerk-org-id': orgId
    },
    params: {
      customerId
    }
  });
  return res.data;
}

// Updated function to add a shop message with title and expiresAt
export async function addShopMessage({ orgId, title, message, expiresAt }: { orgId: string, title: string, message: string, expiresAt?: string }) {
  const res = await api.post('/api/orgs', 
    { title, message, expiresAt },
    {
      headers: {
        'x-clerk-org-id': orgId
      }
    }
  );
  return res.data;
}

// Updated function to edit a shop message with title and expiresAt
export async function updateShopMessage({ 
  orgId, 
  userId, 
  messageId, 
  value, 
  title, 
  expiresAt 
}: { 
  orgId: string, 
  userId: string, 
  messageId: string, 
  value?: string,
  title?: string,
  expiresAt?: string | null
}) {
  const res = await api.put('/api/orgs',
    { 
      messageUpdate: {
        id: messageId,
        value,
        title,
        expiresAt
      }
    },
    {
      headers: {
        'x-clerk-user-id': userId,
        'x-clerk-org-id': orgId,
      }
    }
  );
  return res.data;
}