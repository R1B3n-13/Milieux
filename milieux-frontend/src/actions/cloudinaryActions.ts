"use server";
import { v2 as cloudinary } from "cloudinary";
import { UploadApiResponse } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function uploadToCloudinary(file: string) {
  if (!file) {
    return { success: false, url: null };
  }

  try {
    const uploadResult: UploadApiResponse = await cloudinary.uploader.upload(
      file
    );

    return { success: true, url: uploadResult.url };
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    return { success: false, url: null };
  }
}
