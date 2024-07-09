"use server";

import { LoginSchema, RegisterSchema } from "@/schemas/authSchema";
import { z } from "zod";
import { cookies } from "next/headers";

const backendUrl = process.env.BACKEND_URL;

const jwtConfig = {
  maxAge: parseInt(process.env.JWT_EXPIRATION || "86400"),
  path: "/",
  domain: process.env.HOST ?? "localhost",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
};

export async function registerUser(userData: z.infer<typeof RegisterSchema>) {
  try {
    const url = new URL("/auth/register", backendUrl);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
      cache: "no-cache",
    });

    return response.json();
  } catch (error) {
    console.error("Registration Service Error:", error);
    return {
      status: 500,
      success: false,
      message: "Uh oh! Something went wrong. Please try again.",
    };
  }
}

export async function loginUser(userData: z.infer<typeof LoginSchema>) {
  try {
    const url = new URL("/auth/login", backendUrl);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
      cache: "no-cache",
    });

    const responseData = await response.json();

    if (response.ok) {
      cookies().set("jwt", responseData.token, jwtConfig);
      return {
        status: responseData.status,
        success: responseData.success,
        message: responseData.message,
      };
    }

    return responseData;
  } catch (error) {
    console.error("Login Service Error:", error);
    return {
      status: 500,
      success: false,
      message: "Uh oh! Something went wrong. Please try again.",
    };
  }
}

export default async function getAuthToken() {
  const authToken = cookies().get("jwt")?.value;
  return authToken;
}
