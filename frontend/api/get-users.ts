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
  const requestBody = { userId, ...userData };
  const headers = {
    "x-api-key": API_KEY,
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.patch(
      `${API_BASE_URL}/api/users`,
      requestBody,
      { headers }
    );
    return response.data;
  } catch (error: any) {
    console.error("Update User Error:", error?.response?.data || error.message); // Log the error
    throw error;
  }
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