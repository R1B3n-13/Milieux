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

export async function likePost(postId: number | undefined) {
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
        tags: ["likePost"],
      },
    });

    return response.json();
  } catch (error) {
    console.error("Liking post resulted in error:", error);
    return {
      status: 500,
      success: false,
      message: "Uh oh! Something went wrong. Please try again.",
    };
  }
}
