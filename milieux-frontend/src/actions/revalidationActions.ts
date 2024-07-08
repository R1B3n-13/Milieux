"use server";

import { revalidateTag } from "next/cache";

export async function revalidateLike() {
  revalidateTag("likePost");
}

export async function revalidateComment() {
  revalidateTag("createComment");
}
