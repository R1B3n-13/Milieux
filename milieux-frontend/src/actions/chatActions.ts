"use server";

import getAuthToken from "@/actions/authActions";

const backendUrl = process.env.BACKEND_URL;

export async function createChat(userId: number | null | undefined) {
  const authToken = await getAuthToken();

  try {
    if (!userId) {
      throw new Error("Invalid user id.");
    }

    const url = new URL("/chats/create", backendUrl);

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
      body: JSON.stringify(userId),
      cache: "no-cache",
      next: {
        tags: ["createChat"],
      },
    });

    return response.json();
  } catch (error) {
    console.error("Creating chat resulted in error:", error);
    return {
      status: 500,
      success: false,
      message: "Uh oh! Something went wrong. Please try again.",
    };
  }
}

export async function sendMessage({
  chatId,
  message,
}: {
  chatId: number | null | undefined;
  message: { text: string; imagePath: string | null; messageType: string };
}) {
  const authToken = await getAuthToken();

  try {
    if (!chatId) {
      throw new Error("Invalid chat id.");
    }

    const url = new URL(`/messages/create/${chatId}`, backendUrl);

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
      body: JSON.stringify(message),
      cache: "no-cache",
      next: {
        tags: ["message"],
      },
    });

    return response.json();
  } catch (error) {
    console.error("Sending message resulted in error:", error);
    return {
      status: 500,
      success: false,
      message: "Uh oh! Something went wrong. Please try again.",
    };
  }
}
