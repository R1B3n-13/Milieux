import getAuthToken from "@/actions/authActions";
import { getBackendUrl } from "@/actions/getEnvVarActions";

const backendUrl = process.env.BACKEND_URL;

export async function getAiChatSessions(chatbotId: number | null | undefined) {
  const authToken = await getAuthToken();

  try {
    if (!chatbotId) {
      throw new Error("Invalid chatbot id.");
    }

    const url = new URL(
      `/ai-chat-session/by-chatbot_id/${chatbotId}`,
      backendUrl || (await getBackendUrl())
    );

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
    console.error("Fetching ai chat sessions resulted in error:", error);
    return {
      status: 500,
      success: false,
      message: "Uh oh! Something went wrong. Please try again.",
    };
  }
}

export async function getAiChatSessionHistory(
  chatSessionId: number | null | undefined
) {
  const authToken = await getAuthToken();

  try {
    if (!chatSessionId) {
      throw new Error("Invalid chat session id.");
    }

    const url = new URL(
      `/ai-chat-session/history/${chatSessionId}`,
      backendUrl || (await getBackendUrl())
    );

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
    console.error("Fetching ai chat session history resulted in error:", error);
    return {
      status: 500,
      success: false,
      message: "Uh oh! Something went wrong. Please try again.",
    };
  }
}
