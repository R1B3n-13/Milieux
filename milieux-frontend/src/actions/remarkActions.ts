"use server";

import RemarkSchema from "@/schemas/remarkSchema";
import getAuthToken from "@/actions/authActions";
import { z } from "zod";

const backendUrl = process.env.BACKEND_URL;

export async function createRemark(
  remarkData: z.infer<typeof RemarkSchema>,
  postId: number | undefined | null
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
      body: JSON.stringify(remarkData),
      cache: "no-cache",
      next: {
        tags: ["createRemark"],
      },
    });

    return response.json();
  } catch (error) {
    console.error("Creating remark resulted in error:", error);
    return {
      status: 500,
      success: false,
      message: "Uh oh! Something went wrong. Please try again.",
    };
  }
}
