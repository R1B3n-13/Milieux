"use server";

import getAuthToken from "@/actions/authActions";

const backendUrl = process.env.BACKEND_URL;

export async function createChat(userId: number | null | undefined) {
  try {
    if (!userId) {
      throw new Error("Invalid user id.");
    }

    const url = new URL("/chats/create", backendUrl);

    const authToken = await getAuthToken();
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

export async function getChatMessages(chatId: number | null | undefined) {
  try {
    if (!chatId) {
      throw new Error("Invalid chat id.");
    }

    const url = new URL(`/messages/${chatId}`, backendUrl);

    const authToken = await getAuthToken();
    if (!authToken)
      return {
        status: 401,
        success: false,
        message: "Jwt auth token is missing",
      };

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      cache: "no-cache",
      next: {
        tags: ["message"],
      },
    });

    return response.json();
  } catch (error) {
    console.error("Fetching chat messages resulted in error:", error);
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
  message: { text: string; imagePath: string | null };
}) {
  try {
    if (!chatId) {
      throw new Error("Invalid chat id.");
    }

    const url = new URL(`/messages/create/${chatId}`, backendUrl);

    const authToken = await getAuthToken();
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
