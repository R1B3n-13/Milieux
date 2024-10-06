"use server";

import getAuthToken from "@/actions/social/authActions";

const backendUrl = process.env.BACKEND_URL;

export async function updateUser(userData: { isStoreLandingPage: boolean }) {
  const authToken = await getAuthToken();

  try {
    const url = new URL("/users/update", backendUrl);

    if (!authToken)
      return {
        status: 401,
        success: false,
        message: "Jwt auth token is missing",
      };

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(userData),
      cache: "no-cache",
      next: {
        tags: ["updateUser"],
      },
    });

    return response.json();
  } catch (error) {
    console.error("Updating user resulted in error:", error);
    return {
      status: 500,
      success: false,
      message: "Uh oh! Something went wrong. Please try again.",
    };
  }
}
