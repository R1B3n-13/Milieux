"use server";

import PostSchema from "@/schemas/postSchema";
import getAuthToken from "@/actions/authActions";
import { z } from "zod";

const backendUrl = process.env.BACKEND_URL;

export async function createPost(postData: z.infer<typeof PostSchema>) {
  const authToken = await getAuthToken();

  try {
    const url = new URL("/posts/create", backendUrl);

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
      body: JSON.stringify(postData),
      cache: "no-cache",
      next: {
        tags: ["createPost"],
      },
    });

    return response.json();
  } catch (error) {
    console.error("Creating post resulted in error:", error);
    return {
      status: 500,
      success: false,
      message: "Uh oh! Something went wrong. Please try again.",
    };
  }
}

export async function updatePost(
  postData: z.infer<typeof PostSchema>,
  postId: number | null | undefined
) {
  const authToken = await getAuthToken();

  try {
    if (!postId) throw new Error("Invalid post id.");

    const url = new URL(`/posts/update/${postId}`, backendUrl);

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
      body: JSON.stringify(postData),
      cache: "no-cache",
      next: {
        tags: ["updatePost"],
      },
    });

    return response.json();
  } catch (error) {
    console.error("Updating user resulted in error:", error);
    return {
      status: 500,
      success: false,
      message: "Uh oh! Something went wrong. Please try again.",
    };
  }
}

export async function appreciatePost(postId: number | undefined | null) {
  const authToken = await getAuthToken();

  try {
    if (!postId) throw new Error("Invalid post id.");

    const url = new URL(`/posts/like/${postId}`, backendUrl);

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
      cache: "no-cache",
      next: {
        tags: ["appreciatePost"],
      },
    });

    return response.json();
  } catch (error) {
    console.error("Appreciating post resulted in error:", error);
    return {
      status: 500,
      success: false,
      message: "Uh oh! Something went wrong. Please try again.",
    };
  }
}

export async function bookmarkPost(postId: number | undefined | null) {
  const authToken = await getAuthToken();

  try {
    if (!postId) throw new Error("Invalid post id.");

    const url = new URL(`/posts/save/${postId}`, backendUrl);

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
      cache: "no-cache",
      next: {
        tags: ["bookmarkPost"],
      },
    });

    return response.json();
  } catch (error) {
    console.error("Bookmarking post resulted in error:", error);
    return {
      status: 500,
      success: false,
      message: "Uh oh! Something went wrong. Please try again.",
    };
  }
}
