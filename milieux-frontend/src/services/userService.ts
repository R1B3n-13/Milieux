import getAuthToken from "@/actions/authActions";

const backendUrl = process.env.BACKEND_URL;

export async function getUserFromAuthToken() {
  try {
    const url = new URL("/users/profile", backendUrl);

    const authToken = await getAuthToken();
    if (!authToken)
      return {
        status: 401,
        success: false,
        message: "Jwt auth token is missing",
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

export async function getUserById(userId: number | undefined | null) {
  try {
    if (!userId) {
      throw Error("Invalid user id.");
    }

    const url = new URL(`/users/${userId}`, backendUrl);

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
    console.error("Fetching user resulted in error:", error);
    return {
      status: 500,
      success: false,
      message: "Uh oh! Something went wrong. Please try again.",
    };
  }
}

export async function getUsersByIds(data: number[]) {
  try {
    const url = new URL("/users/by-ids", backendUrl);

    const authToken = await getAuthToken();
    if (!authToken)
      return {
        status: 401,
        success: false,
        message: "Jwt auth token is missing",
      };

    const response = await fetch(url, {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(data),
      cache: "no-cache",
    });

    const responseData = await response.json();

    return responseData;
  } catch (error) {
    console.error("Fetching users resulted in error:", error);
    return {
      status: 500,
      success: false,
      message: "Uh oh! Something went wrong. Please try again.",
    };
  }
}
