import getAuthToken from "@/utils/getAuthToken";

const backendUrl = process.env.BACKEND_URL;

export async function getAllPosts() {
  try {
    const url = new URL("/posts", backendUrl);

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

    return response.json();
  } catch (error) {
    console.error("Fetching posts resulted in error:", error);
    return {
      status: 500,
      success: false,
      message: "Uh oh! Something went wrong. Please try again.",
    };
  }
}
