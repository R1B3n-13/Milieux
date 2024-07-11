"use client";

import { Button } from "@/components/ui/Button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/AlertDialog";
import { ChangeEvent, useState } from "react";
import { toast } from "sonner";
import { Textarea } from "../ui/Textarea";
import ImageFilledIcon from "../icons/ImageFilledIcon";
import VideoFilledIcon2 from "../icons/VideoFilledIcon2";
import { Input } from "../ui/Input";
import Image from "next/image";
import uploadToCloudinary from "@/actions/cloudinaryActions";
import { createPost } from "@/actions/postActions";
import Loading from "./Loading";
import VideoPlayer from "./VideoPlayer";
import { revalidatePost } from "@/actions/revalidationActions";

export default function PostSubmissionDialog({
  dialogButton,
  username,
}: {
  dialogButton: JSX.Element;
  username: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState<string>("");
  const [selectedMedia, setSelectedMedia] = useState<
    string | ArrayBuffer | null
  >(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | undefined>(
    undefined
  );

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

  const clearMedia = () => {
    setSelectedMedia(null);
    setMediaType(undefined);
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
      text,
      imagePath,
      videoPath,
    };

    const response = await createPost(data);

    if (!response.success) {
      toast.error("Something went wrong.");
    } else {
      toast.success("Post created successfully!");
    }

    setIsLoading(false);

    setText("");
    setSelectedMedia(null);
    setMediaType(undefined);
    revalidatePost();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{dialogButton}</AlertDialogTrigger>
      <AlertDialogContent className="w-full">
        <AlertDialogHeader>
          <div className="flex flex-col gap-2 items-center justify-center">
            <AlertDialogTitle>Create post</AlertDialogTitle>
            <AlertDialogDescription>
              Post to the stream from here. Click post when you're done.
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>
        <div className="space-y-6">
          <div className="space-y-4">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={`What's brewing, ${username}?`}
              className="h-40 focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-gray-400"
            />
          </div>

          {selectedMedia && (
            <div className="flex items-center justify-center relative">
              {mediaType === "image" ? (
                <div className="w-fit relative">
                  <Image
                    src={selectedMedia as string}
                    alt=""
                    width={200}
                    height={200}
                    className="rounded-lg"
                  />
                  <button
                    className="absolute top-1 right-1 px-1 rounded-sm bg-red-500 text-white text-sm cursor-pointer"
                    onClick={clearMedia}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="w-fit max-w-36 relative">
                  <VideoPlayer
                    src={selectedMedia as string}
                    width={200}
                    className="w-full h-full rounded-lg"
                    controls
                    autoPlay={false}
                  />
                  <button
                    className="absolute top-1 right-1 px-1 rounded-sm bg-red-500 text-white text-sm cursor-pointer"
                    onClick={clearMedia}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="flex p-0 m-0 items-center justify-center gap-3 text-xl text-slate-700">
            <div className="flex rounded-lg w-full p-2 items-center justify-center cursor-pointer gap-2 hover:bg-muted">
              <Input
                id="image-input"
                type="file"
                accept="image/*"
                onChange={handleMediaChange}
                style={{ display: "none" }}
              />
              <label htmlFor="image-input">
                <div className="flex items-center justify-center gap-2 cursor-pointer">
                  <div className="text-blue-600">
                    <ImageFilledIcon />
                  </div>
                  <p className="text-base font-semibold">Image</p>
                </div>
              </label>
            </div>

            <div className="flex rounded-lg w-full p-2 items-center justify-center cursor-pointer gap-2 hover:bg-muted">
              <Input
                id="video-input"
                type="file"
                accept="video/*"
                onChange={handleMediaChange}
                style={{ display: "none" }}
              />
              <label htmlFor="video-input">
                <div className="flex items-center justify-center gap-2 cursor-pointer">
                  <div className="text-rose-600">
                    <VideoFilledIcon2 />
                  </div>
                  <p className="text-base font-semibold">Video</p>
                </div>
              </label>
            </div>
          </div>

          <AlertDialogFooter>
            <div className="flex justify-end gap-4">
              <AlertDialogCancel onClick={clearMedia}>Cancel</AlertDialogCancel>
              <Button
                onClick={handleSubmit}
                disabled={isLoading || (!text && !selectedMedia)}
                className="px-6"
              >
                {isLoading ? <Loading text="Loading..." /> : "Post"}
              </Button>
            </div>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
