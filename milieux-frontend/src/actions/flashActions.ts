"use server";

import FlashSchema from "@/schemas/remarkSchema";
import getAuthToken from "@/actions/authActions";
import { z } from "zod";

const backendUrl = process.env.BACKEND_URL;

export async function createFlash(flashData: z.infer<typeof FlashSchema>) {
  try {
    const url = new URL("/reels/create", backendUrl);

    const authToken = await getAuthToken();
    if (!authToken)
      return {
        status: 401,
        success: false,
        message: "Jwt auth token is missing",
      };

    const response = await fetch(url, {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(flashData),
      cache: "no-cache",
      next: {
        tags: ["createFlash"],
      },
    });

    return response.json();
  } catch (error) {
    console.error("Creating reel resulted in error:", error);
    return {
      status: 500,
      success: false,
      message: "Uh oh! Something went wrong. Please try again.",
    };
  }
}
