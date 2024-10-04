"use client";

import { useStoreContext } from "@/contexts/StoreContext";
import React, { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

import uploadToCloudinary from "@/app/api/cloudinaryActions";

const CustomizeUiImages = () => {
  const ecommBackend = process.env.NEXT_PUBLIC_ECOMM_BACKEND_URL;
const PORT = ecommBackend ? process.env[ecommBackend] : "http://localhost:8082/api";
  const { storeInfo, setStoreInfo, authToken } = useStoreContext();
  const [error, setError] = useState<string | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const updateUiImages = async (updatedImages: string[]) => {
    try {
      const response = await fetch(
        `${PORT}/store/update/ui-images/${storeInfo.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(updatedImages),
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Store not found");
        } else {
          throw new Error("Failed to update store images");
        }
      }

      // After successful image update, update the StoreContext with the new images
      setStoreInfo((prevStoreInfo: any) => ({
        ...prevStoreInfo,
        ui_images: updatedImages,
      }));
    } catch (error: any) {
      console.error("Error updating images:", error);
      setError(error.message || "Failed to update images");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleHeroUpdate = async () => {
    try {
      let uploadedImageUrl = null;

      // If a file is selected, upload it to Cloudinary
      const fileReader = new FileReader();

      if (selectedFile) {
        fileReader.readAsDataURL(selectedFile);
      } else {
        throw new Error("No file selected");
      }

      fileReader.onload = async () => {
        const fileBase64 = fileReader.result as string;

        const { success, url } = await uploadToCloudinary(fileBase64, "image");

        if (success) {
          uploadedImageUrl = url;
          console.log("Image uploaded:", uploadedImageUrl);
        } else {
          throw new Error("Image upload failed");
        }

        // After successful image upload, update the store's ui_images
        // await updateUiImages([...storeInfo.ui_images, uploadedImageUrl]);
        if (storeInfo.ui_images) {
          await updateUiImages([...storeInfo.ui_images, uploadedImageUrl]);
        } else {
          if (uploadedImageUrl) {
            await updateUiImages([uploadedImageUrl]);
          } else {
            throw new Error("Uploaded image URL is null");
          }
        }
      };
    } catch (error: any) {
      console.error("Error updating store UI:", error);
      setError(error.message || "Failed to update store UI");
    }
  };

  // Delete image functionality
  const handleDeleteImage = async (index: number) => {
    const updatedImages = storeInfo.ui_images.filter(
      (_: string, i: number) => i !== index
    );

    // Update images in the backend
    await updateUiImages(updatedImages);
  };

  return (
    <>
      <div className="flex flex-col gap-2 w-max">
        {storeInfo.ui_images && (
          <Card className="flex flex-wrap p-2 gap-2">
            {storeInfo.ui_images.map((img: string, index: number) => (
              <CardContent
                key={index}
                className="flex flex-col items-center justify-between border-[1.5px] rounded-xl border-gray-200 w-fit h-[200px] p-4"
              >
                <div className="flex flex-1 justify-center items-center">
                  <Image
                    src={img}
                    alt="Hero Image"
                    width={100}
                    height={100}
                    className="object-contain"
                  />
                </div>

                <CardFooter className="flex flex-row items-center justify-center">
                  <Button
                    className="w-max bg-red-500 text-white hover:bg-red-700 mt-auto pt-2"
                    variant={"ghost"}
                    onClick={() => handleDeleteImage(index)} // Call delete function on click
                  >
                    Delete
                  </Button>
                </CardFooter>
              </CardContent>
            ))}
          </Card>
        )}
        <div className="flex justify-center items-center gap-2">
          <Input
            className="w-7/12 border-[1.5px] border-gray-200 focus:border-none"
            placeholder="Upload more images"
            type="file"
            onChange={handleFileChange}
          />
          <Button
            onClick={handleHeroUpdate}
            className="w-fit h-fit bg-black text-white hover:bg-gray-800 hover:text-white"
            variant={"ghost"}
          >
            Submit
          </Button>
        </div>
      </div>
    </>
  );
};

export default CustomizeUiImages;
