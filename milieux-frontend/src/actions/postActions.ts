"use server";

import PostSchema from "@/schemas/postSchema";
import getAuthToken from "@/actions/authActions";
import { z } from "zod";

const backendUrl = process.env.BACKEND_URL;

export async function createPost(postData: z.infer<typeof PostSchema>) {
  try {
    const url = new URL("/posts/create", backendUrl);

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

export async function appreciatePost(postId: number | undefined | null) {
  try {
    if (!postId) throw new Error("Invalid post id.");

    const url = new URL(`/posts/like/${postId}`, backendUrl);

    const authToken = await getAuthToken();
    if (!authToken)
      return {
        status: 401,
        success: false,
        message: "Jwt auth token is missing",
      };

    const response = await fetch(url, {
      method: "Put",
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
  try {
    if (!postId) throw new Error("Invalid post id.");

    const url = new URL(`/posts/save/${postId}`, backendUrl);

    const authToken = await getAuthToken();
    if (!authToken)
      return {
        status: 401,
        success: false,
        message: "Jwt auth token is missing",
      };

    const response = await fetch(url, {
      method: "Put",
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
