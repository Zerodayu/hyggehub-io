import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    // "Access-Control-Allow-Origin": "*",
    "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
    "x-vercel-protection-bypass": process.env.VERCEL_AUTOMATION_BYPASS_SECRET!
  },
});

export default api;