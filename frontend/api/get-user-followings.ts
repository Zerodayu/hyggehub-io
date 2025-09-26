import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = "https://coffee-shop-app-ruddy.vercel.app";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export const fetchUserShops = async (clerkId: string) => {
  const response = await axios.get(`${API_BASE_URL}/api/users?clerkId=${clerkId}`, {
    headers: { "x-api-key": API_KEY },
  });
  return response.data.followedShops;
};

export const useUserShops = (clerkId: string | undefined) => {
  return useQuery({
    queryKey: ["userShops", clerkId],
    queryFn: () => clerkId ? fetchUserShops(clerkId) : [],
    enabled: !!clerkId,
  });
};