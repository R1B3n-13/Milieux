"use server";

export async function getBackendUrl() {
  return process.env.BACKEND_URL;
}
