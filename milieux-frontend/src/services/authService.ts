import { RegisterSchema } from "@/schemas/authSchema";
import { z } from "zod";

export async function registerUser(userData: z.infer<typeof RegisterSchema>) {
  const url = new URL("http://localhost:8080/auth/register");

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...userData }),
      cache: "no-cache",
    });

    return response.json();
  } catch (error) {
    console.error("Registration Service Error:", error);
  }
}
