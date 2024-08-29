import getAuthToken from "@/actions/authActions";

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