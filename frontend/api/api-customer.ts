import api from "@/lib/axios";

export async function claimShopCode({
  customers,
  shopCode,
}: {
  customers: Array<{ name: string; phone: string; birthday: string }> | { name: string; phone: string; birthday: string };
  shopCode: string;
}) {
  // Normalize to array if single object
  const customersArray = Array.isArray(customers) ? customers : [customers];
  
  // Add shopCode to each customer
  const customersWithShopCode = customersArray.map(customer => ({
    ...customer,
    shopCode,
  }));
  
  const res = await api.post("/api/customers", customersWithShopCode);
  return res.data;
}