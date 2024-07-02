"use server";

import getAuthToken from "@/utils/getAuthToken";

const backendUrl = process.env.BACKEND_URL;

export async function getUserFromAuthToken() {
  try {
    const url = new URL("/users/profile", backendUrl);

    const authToken = await getAuthToken();
    if (!authToken) return { ok: false, data: null, error: null };

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      cache: "no-cache",
    });

    const responseData = await response.json();

    if (response.ok) {
      return { ok: true, data: responseData, error: null };
    } else {
      console.error("Loading user failed:", responseData.message);
      return { ok: false, data: null, error: responseData.message };
    }
  } catch (error) {
    console.error("Loading user failed:", error);
    return { ok: false, data: null, error: error };
  }
}
