import getAuthToken from "@/actions/authActions";
import { getBackendUrl } from "@/actions/getEnvVarActions";

export async function getAiChatParams(userId: number | null | undefined) {
  const authToken = await getAuthToken();

  try {
    if (!userId) {
      throw new Error("Invalid user id.");
    }

    const url = new URL(`/ai-chat/params/${userId}`, await getBackendUrl());

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

    return response.json();
  } catch (error) {
    console.error("Fetching ai chat params resulted in error:", error);
    return {
      status: 500,
      success: false,
      message: "Uh oh! Something went wrong. Please try again.",
    };
  }
}

export async function getAiTool(userId: number | null | undefined) {
  const authToken = await getAuthToken();

  try {
    if (!userId) {
      throw new Error("Invalid user id.");
    }

    const url = new URL(`/ai-chat/tools/${userId}`, await getBackendUrl());

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

    return response.json();
  } catch (error) {
    console.error("Fetching ai tool resulted in error:", error);
    return {
      status: 500,
      success: false,
      message: "Uh oh! Something went wrong. Please try again.",
    };
  }
}
