import { cookies } from "next/headers";

export default async function getAuthToken() {
  const authToken = cookies().get("jwt")?.value;
  return authToken;
}
