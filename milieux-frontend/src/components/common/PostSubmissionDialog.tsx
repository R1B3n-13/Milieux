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

export default function PostSubmissionDialog({
  dialogButton,
  username,
}: {
  dialogButton: JSX.Element;
  username: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<
    string | ArrayBuffer | null
  >(null);
  const [selectedVideo, setSelectedVideo] = useState<
    string | ArrayBuffer | null
  >(null);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const fReader = new FileReader();
      fReader.readAsDataURL(file);

      fReader.onloadend = function (event) {
        const result = event.target?.result;
        if (result) {
          setSelectedImage(result);
        }
      };
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
  };

  const handleVideoChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const fReader = new FileReader();
      fReader.readAsDataURL(file);

      fReader.onloadend = function (event) {
        const result = event.target?.result;
        if (result) {
          setSelectedVideo(result);
        }
      };
    }
  };

  const clearVideo = () => {
    setSelectedVideo(null);
  };

  const onSubmit = async () => {
    setIsLoading(true);

    let imagePath = null;
    let videoPath = null;

    if (selectedImage) {
      const uploadResult = await uploadToCloudinary(selectedImage as string);

      if (!uploadResult.success) {
        toast.error("Upload failed.");
        setIsLoading(false);
        return;
      } else {
        imagePath = uploadResult.url;
      }
    }

    if (selectedVideo) {
      const uploadResult = await uploadToCloudinary(selectedVideo as string);

      if (!uploadResult.success) {
        toast.error("Upload failed.");
        setIsLoading(false);
        return;
      } else {
        videoPath = uploadResult.url;
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
    setSelectedImage(null);
    setSelectedVideo(null);
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

          {selectedImage && (
            <div className="flex items-center justify-center">
              <div className="relative">
                <Image
                  src={selectedImage as string}
                  alt=""
                  width={200}
                  height={200}
                />
                <button
                  className="absolute top-1 right-1 px-1 bg-red-500 text-white text-sm cursor-pointer"
                  onClick={() => clearImage()}
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          <div className="flex p-0 m-0 items-center justify-center gap-3 text-xl text-slate-700">
            <div className="flex rounded-lg w-full p-2 items-center justify-center cursor-pointer gap-2 hover:bg-muted">
              <Input
                id="image-input-post"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
              <label htmlFor="image-input-post">
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
                onChange={handleVideoChange}
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
              onClick={onSubmit}
              className="w-full"
              disabled={
                isLoading || (!text && !selectedImage && !selectedVideo)
              }
            >
              {isLoading ? <Loading text="Loading..." /> : "Post"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
