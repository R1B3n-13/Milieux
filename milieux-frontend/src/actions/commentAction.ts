"use server";

import CommentSchema from "@/schemas/commentSchema";
import getAuthToken from "@/actions/authActions";
import { z } from "zod";

const backendUrl = process.env.BACKEND_URL;

export async function createComment(
  commentData: z.infer<typeof CommentSchema>,
  postId: number | undefined
) {
  try {
    if (!postId) throw new Error("Invalid post id.");

    const url = new URL(`/comments/create/post/${postId}`, backendUrl);

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
      body: JSON.stringify(commentData),
      cache: "no-cache",
      next: {
        tags: ["createComment"],
      },
    });

    return response.json();
  } catch (error) {
    console.error("Creating comment resulted in error:", error);
    return {
      status: 500,
      success: false,
      message: "Uh oh! Something went wrong. Please try again.",
    };
  }
}
