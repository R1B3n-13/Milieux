"use server";

import getAuthToken from "@/actions/authActions";

const backendUrl = process.env.BACKEND_URL;

export async function createAiChatSession(
  chatbotId: number | null | undefined,
  data: {
    name: string;
    chatHistory: { role: "user" | "model"; parts: string }[];
  }
) {
  const authToken = await getAuthToken();

  try {
    if (!chatbotId) {
      throw new Error("Invalid chatbot id.");
    }

    const url = new URL(`/ai-chat-session/create/${chatbotId}`, backendUrl);

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
        tags: ["createAiChatSession"],
      },
    });

    return response.json();
  } catch (error) {
    console.error("Creating ai chat session resulted in error:", error);
    return {
      status: 500,
      success: false,
      message: "Uh oh! Something went wrong. Please try again.",
    };
  }
}

export async function updateAiChatSessionHistory(
  data: {
    chatHistory: { role: "user" | "model"; parts: string }[];
  },
  chatSessionId: number | null | undefined
) {
  const authToken = await getAuthToken();

  try {
    if (!chatSessionId) {
      throw new Error("Invalid chat session id.");
    }

    const url = new URL(`/ai-chat-session/update/${chatSessionId}`, backendUrl);

    if (!authToken)
      return {
        status: 401,
        success: false,
        message: "Jwt auth token is missing",
      };

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(data),
      cache: "no-cache",
      next: {
        tags: ["updateAiChatSession"],
      },
    });

    return response.json();
  } catch (error) {
    console.error("Updating ai chat session resulted in error:", error);
    return {
      status: 500,
      success: false,
      message: "Uh oh! Something went wrong. Please try again.",
    };
  }
}

export async function deleteAiChatSession(
  chatSessionId: number | null | undefined
) {
  const authToken = await getAuthToken();

  try {
    if (!chatSessionId) {
      throw new Error("Invalid chat session id.");
    }

    const url = new URL(`/ai-chat-session/delete/${chatSessionId}`, backendUrl);

    if (!authToken)
      return {
        status: 401,
        success: false,
        message: "Jwt auth token is missing",
      };

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      cache: "no-cache",
      next: {
        tags: ["deleteAiChatSession"],
      },
    });

    if (response.status === 204) {
      return {
        status: 204,
        success: true,
        message: `Ai chat session deleted successfully!`,
      };
    } else {
      throw new Error("Ai chat session deletion failed.");
    }
  } catch (error) {
    console.error("Deleting ai chat session resulted in error:", error);
    return {
      status: 500,
      success: false,
      message: "Uh oh! Something went wrong. Please try again.",
    };
  }
}
