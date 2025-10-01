
export { PUT } from "./handlers/put"; // update a shops code and phoneNo
export { GET } from "./handlers/get"; // get org info and connected users

import { withCORS } from "@/cors";

export async function OPTIONS() {
  return withCORS(new Response(null, { status: 204 }));
}