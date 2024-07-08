import getAuthToken from "@/utils/getAuthToken";

const backendUrl = process.env.BACKEND_URL;

export async function getUserFromAuthToken() {
  try {
    const url = new URL("/users/profile", backendUrl);

    const authToken = await getAuthToken();
    if (!authToken)
      return {
        status: 401,
        success: false,
        message: "Loading user failed.",
        user: null,
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
    console.error("Loading user failed:", error);
    return {
      status: 401,
      success: false,
      message: "Loading user failed.",
      user: null,
    };
  }
}
