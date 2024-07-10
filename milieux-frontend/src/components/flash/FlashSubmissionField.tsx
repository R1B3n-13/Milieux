"use client";

import { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import VideoPlayer from "@/components/common/VideoPlayer";
import { useRouter } from "next/navigation";

const FlashSubmissionField = () => {
  const [selectedMedia, setSelectedMedia] = useState<
    string | ArrayBuffer | null
  >(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);

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
    setMediaType(null);
    router.push("/stream");
  };

  const handleSubmit = async () => {
    console.log("Submitting story");
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
          <div className="relative mb-4">
            {mediaType === "image" ? (
              <Image
                src={selectedMedia as string}
                alt=""
                layout="responsive"
                width={700}
                height={475}
                className="rounded-lg"
              />
            ) : (
              <VideoPlayer
                src={selectedMedia as string}
                className="rounded-lg"
              />
            )}

            <button
              className="absolute top-1 right-1 px-1 bg-red-500 text-white text-sm cursor-pointer"
              onClick={() => {
                setSelectedMedia(null);
                setMediaType(null);
              }}
            >
              ✕
            </button>
          </div>
        )}

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedMedia}>
            Share
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FlashSubmissionField;
