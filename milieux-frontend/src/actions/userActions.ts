"use server";

import getAuthToken from "@/actions/authActions";
import { z } from "zod";
import UserSchema from "@/schemas/userSchema";

const backendUrl = process.env.BACKEND_URL;

export async function updateUser(userData: z.infer<typeof UserSchema>) {
  try {
    const url = new URL("/users/update", backendUrl);

    const authToken = await getAuthToken();
    if (!authToken)
      return {
        status: 401,
        success: false,
        message: "Jwt auth token is missing",
      };

    const response = await fetch(url, {
      method: "Put",
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

export async function followUser(userId: number | null | undefined) {
  try {
    if (!userId) throw new Error("Invalid user id");

    const url = new URL(`/users/follow/${userId}`, backendUrl);

    const authToken = await getAuthToken();
    if (!authToken)
      return {
        status: 401,
        success: false,
        message: "Jwt auth token is missing",
      };

    const response = await fetch(url, {
      method: "Put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      cache: "no-cache",
      next: {
        tags: ["followUser"],
      },
    });

    return response.json();
  } catch (error) {
    console.error("Following user resulted in error:", error);
    return {
      status: 500,
      success: false,
      message: "Uh oh! Something went wrong. Please try again.",
    };
  }
}
