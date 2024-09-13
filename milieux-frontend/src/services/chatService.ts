import getAuthToken from "@/actions/authActions";
import { getBackendUrl } from "@/actions/getEnvVarActions";

const backendUrl = process.env.BACKEND_URL;

export async function getChats() {
  try {
    const url = new URL("/chats/by-user_id", backendUrl);

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
    });

    const responseData = await response.json();

    return responseData;
  } catch (error) {
    console.error("Fetching chats resulted in error:", error);
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

    const url = new URL(`/messages/${chatId}`, await getBackendUrl());

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
