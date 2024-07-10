"use client";

import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
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
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);

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
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    let imagePath = null;
    let videoPath = null;

    if (selectedMedia) {
      const uploadResult = await uploadToCloudinary(selectedMedia as string);

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
      toast.error(response.message);
    } else {
      toast.success(response.message);
    }

    setIsLoading(false);

    setText("");
    setSelectedMedia(null);
    setMediaType(null);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{dialogButton}</DialogTrigger>
      <DialogContent className="w-full">
        <DialogHeader>
          <div className="flex flex-col gap-2 items-center justify-center">
            <DialogTitle>Create post</DialogTitle>
            <DialogDescription>
              Post to the stream from here. Click post when you're done.
            </DialogDescription>
          </div>
        </DialogHeader>
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
            <div className="relative">
              {mediaType === "image" ? (
                <Image
                  src={selectedMedia as string}
                  alt=""
                  layout="responsive"
                  width={200}
                  height={200}
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

          <DialogFooter>
            <Button
              onClick={handleSubmit}
              className="w-full"
              disabled={isLoading || (!text && !selectedMedia)}
            >
              {isLoading ? <Loading text="Loading..." /> : "Post"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
