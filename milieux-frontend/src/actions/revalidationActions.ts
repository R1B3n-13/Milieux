"use server";

import { revalidateTag } from "next/cache";

export async function revalidateUser() {
  revalidateTag("updateUser");
}

export async function revalidateFollow() {
  revalidateTag("followUser");
}

export async function revalidatePostUpdate() {
  revalidateTag("updatePost");
}

export async function revalidatePost() {
  revalidateTag("createPost");
}

export async function revalidateAppreciation() {
  revalidateTag("appreciatePost");
}

export async function revalidateBookmark() {
  revalidateTag("bookmarkPost");
}

export async function revalidateRemark() {
  revalidateTag("createRemark");
}

export async function revalidateFlash() {
  revalidateTag("createFlash");
}
