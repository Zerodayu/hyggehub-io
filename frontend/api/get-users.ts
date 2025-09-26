import axios from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";

const API_BASE_URL = "https://coffee-shop-app-ruddy.vercel.app";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;


export const fetchUsers = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/users`, {
    headers: {
      "x-api-key": API_KEY,
    },
  });
  return response.data;
};

export const updateUser = async ({
  userId,
  userData,
}: {
  userId: string;
  userData: any;
}) => {
  const response = await axios.patch(
    `${API_BASE_URL}/api/users/${userId}`,
    userData,
    {
      headers: {
        "x-api-key": API_KEY,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });
};

export const useUpdateUser = () => {
  return useMutation({
    mutationFn: updateUser,
  });
};