import getAuthToken from "@/actions/authActions";

const backendUrl = process.env.ECOMM_BACKEND_URL;

export async function getStoreById(storeId: number | null | undefined) {
  try {
    if (!storeId) {
      throw new Error("Invalid store id.");
    }

    const url = `${backendUrl}/store/find/${storeId}`;

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
    if (!response.ok) {
      if (response.status === 404) {
        return {
          status: 404,
          success: false,
          message: "Store not found.",
        };
      } else {
        throw new Error("Error getting store from the backend");
      }
    }

    const responseData = await response.json();

    return {
      status: 200,
      success: true,
      message: "Store fetched successfully!",
      data: responseData,
    };
  } catch (error) {
    console.error("Fetching store resulted in error:", error);
    return {
      status: 500,
      success: false,
      message: "Uh oh! Something went wrong. Please try again.",
    };
  }
}
