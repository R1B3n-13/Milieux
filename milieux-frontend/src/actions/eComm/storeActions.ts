"use server";

import getAuthToken from "@/actions/authActions";

const backendUrl = process.env.ECOMM_BACKEND_URL;

export async function createStore(data: {
  id: number | null | undefined;
  name: string;
  category: string;
}) {
  const authToken = await getAuthToken();

  try {
    if (!data.id) {
      throw new Error("Invalid user id.");
    }

    const url = `${backendUrl}/store/create`;

    if (!authToken)
      return {
        status: 401,
        success: false,
        message: "Jwt auth token is missing",
      };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(data),
      cache: "no-cache",
      next: {
        tags: ["createStore"],
      },
    });

    if (!response.ok) {
      throw new Error("Error creating store.");
    }

    return {
      status: 200,
      success: true,
      message: "Store created successfully!",
    };
  } catch (error) {
    console.error("Creating store resulted in error:", error);
    return {
      status: 500,
      success: false,
      message: "Uh oh! Something went wrong. Please try again.",
    };
  }
}
