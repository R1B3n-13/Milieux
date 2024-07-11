"use client";

import { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import VideoPlayer from "@/components/common/VideoPlayer";
import { useRouter } from "next/navigation";
import Loading from "../common/Loading";
import { toast } from "sonner";
import uploadToCloudinary from "@/actions/cloudinaryActions";
import { revalidateFlash } from "@/actions/revalidationActions";
import { createFlash } from "@/actions/flashActions";

const FlashSubmissionField = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<
    string | ArrayBuffer | null
  >(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | undefined>(
    undefined
  );

  const router = useRouter();

  const handleMediaChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const fileType = file.type.startsWith("video") ? "video" : "image";
      setMediaType(fileType);

      const fReader = new FileReader();
      fReader.readAsDataURL(file);

      fReader.onloadend = function (event) {
        const result = event.target?.result;
        if (result) {
          setSelectedMedia(result);
        }
      };
    }
  };

  const handleCancel = () => {
    setSelectedMedia(null);
    setMediaType(undefined);
    router.push("/stream");
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    let imagePath = null;
    let videoPath = null;

    if (selectedMedia) {
      const uploadResult = await uploadToCloudinary(
        selectedMedia as string,
        mediaType
      );

      if (!uploadResult.success) {
        toast.error("Upload failed.");
        setIsLoading(false);
        return;
      } else {
        mediaType === "image"
          ? (imagePath = uploadResult.url)
          : (videoPath = uploadResult.url);
      }
    }

    const data = {
      imagePath,
      videoPath,
    };

    const response = await createFlash(data);

    if (!response.success) {
      toast.error("Something went wrong.");
    } else {
      toast.success("Flash created successfully!");
      router.push("/stream");
    }

    console.log(response);

    setIsLoading(false);

    setSelectedMedia(null);
    setMediaType(undefined);
    revalidateFlash();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl">
        <h1 className="text-2xl font-semibold mb-4">Create Your Flash</h1>

        {!selectedMedia ? (
          <div className="flex flex-col mb-4 items-center justify-center border-2 border-dashed border-gray-300 p-6 rounded-lg">
            <input
              id="media-input"
              type="file"
              accept="image/*,video/*"
              onChange={handleMediaChange}
              style={{ display: "none" }}
            />
            <label
              htmlFor="media-input"
              className="cursor-pointer text-blue-600 text-lg"
            >
              Click here to select a photo or video
            </label>
          </div>
        ) : (
          <div className="flex items-center justify-center mb-4">
            {mediaType === "image" ? (
              <div className="w-fit relative">
                <Image
                  src={selectedMedia as string}
                  alt=""
                  width={520}
                  height={0}
                  className="rounded-lg"
                />
                <button
                  className="absolute top-1 right-1 px-1 rounded-sm bg-red-500 text-white text-sm cursor-pointer"
                  onClick={() => {
                    setSelectedMedia(null);
                    setMediaType(undefined);
                  }}
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="w-fit relative">
                <VideoPlayer
                  src={selectedMedia as string}
                  className="rounded-lg"
                  width={350}
                  controls
                  autoPlay={false}
                />
                <button
                  className="absolute top-1 right-1 px-1 rounded-sm bg-red-500 text-white text-sm cursor-pointer"
                  onClick={() => {
                    setSelectedMedia(null);
                    setMediaType(undefined);
                  }}
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || !selectedMedia}>
            {isLoading ? <Loading text="Loading..." /> : "Share"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FlashSubmissionField;
