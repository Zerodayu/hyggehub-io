import api from "@/lib/axios";

export async function claimShopCode({
  name,
  phone,
  birthday,
  shopCode,
}: {
  name: string;
  phone: string;
  birthday: string;
  shopCode: string;
}) {
  const res = await api.post("/api/customers", { name, phone, birthday, shopCode });
  return res.data;
}