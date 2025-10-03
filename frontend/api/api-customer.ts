import api from "@/lib/axios";

export async function claimShopCode({
  name,
  phone,
  shopCode,
}: {
  name: string;
  phone: string;
  shopCode: string;
}) {
  const res = await api.post("/api/customers", { name, phone, shopCode });
  return res.data;
}