"use server";

const backendUrl = process.env.AI_BACKEND_URL;

export async function getTidbits(data: {
  text: string;
  media_url: string | null;
}) {
  try {
    const url = new URL("/tidbits", backendUrl);

    const response = await fetch(url, {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-cache",
    });

    return response.json();
  } catch (error) {
    console.error("Getting tidbits resulted in error:", error);
    return {
      status: 500,
      success: false,
      message: "Uh oh! Something went wrong. Please try again.",
    };
  }
}

export async function addPostToCorpus(data: {
  text: string;
  media_url: string | null;
  postId: number;
}) {
  try {
    const url = new URL("/add-post", backendUrl);

    const response = await fetch(url, {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-cache",
    });

    return response.json();
  } catch (error) {
    console.error("Adding post to corpus resulted in error:", error);
    return {
      status: 500,
      success: false,
      message: "Uh oh! Something went wrong. Please try again.",
    };
  }
}

export async function getQueryResponse(data: { query: string }) {
  try {
    const url = new URL("/search", backendUrl);

    const response = await fetch(url, {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-cache",
    });

    return response.json();
  } catch (error) {
    console.error("Getting query response resulted in error:", error);
    return {
      status: 500,
      success: false,
      message: "Uh oh! Something went wrong. Please try again.",
    };
  }
}
