import api from "@/lib/axios";

export async function claimShopCode({
  customers,
  shopCode,
}: {
  customers:
    | Array<{ name: string; phone: string; birthday?: string }>
    | { name: string; phone: string; birthday?: string };
  shopCode: string;
}) {
  // Normalize to array if single object
  const customersArray = Array.isArray(customers) ? customers : [customers];

  // Frontend guard: require non-empty name and phone before sending payload
  const invalidCustomers = customersArray.filter((customer) => {
    const name = customer?.name?.trim();
    const phone = customer?.phone?.trim();
    return !name || !phone;
  });

  if (invalidCustomers.length > 0) {
    throw new Error("Each customer must include both name and phone.");
  }

  // Add shopCode to each valid customer
  const customersWithShopCode = customersArray.map((customer) => ({
    ...customer,
    name: customer.name.trim(),
    phone: customer.phone.trim(),
    shopCode,
  }));

  const res = await api.post("/api/customers", customersWithShopCode);
  return res.data;
}
