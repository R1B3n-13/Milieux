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
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { TextArea } from "../ui/TextArea";
import ImageFilledIcon from "../icons/ImageFilledIcon";
import VideoFilledIcon2 from "../icons/VideoFilledIcon2";
import { Input } from "../ui/Input";
import Image from "next/image";
import uploadToCloudinary from "@/actions/cloudinaryActions";
import { createPost, updatePost } from "@/actions/postActions";
import Loading from "./Loading";
import VideoPlayer from "./VideoPlayer";
import {
  revalidatePost,
  revalidatePostUpdate,
} from "@/actions/revalidationActions";
import {
  addPostToCorpus,
  checkAndCorrectText,
  getTidbits,
} from "@/actions/aiActions";
import ProofReadingLineIcon from "../icons/ProofReadingLineIcon";
import ProofReadingFilledIcon from "../icons/ProofReadingFilledIcon";
import { readStreamableValue } from "ai/rsc";

export default function PostSubmissionDialog({
  dialogButton,
  username,
}: {
  dialogButton: JSX.Element;
  username: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState<string>("");
  const [isProofOn, setIsProofOn] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<
    string | ArrayBuffer | null
  >(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | undefined>(
    undefined
  );
  const [correctedText, setCorrectedText] = useState("");
  const scrollAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleProofReading = async () => {
    if (text.trim() === "") return;

    const data = {
      text,
    };

    const { result } = await checkAndCorrectText(data);

    let textStream = "";

    for await (const delta of readStreamableValue(result)) {
      textStream += delta;
      setCorrectedText(textStream);
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [correctedText]);

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
    let media_url = null;

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
        media_url = uploadResult.url;
        mediaType === "image"
          ? (imagePath = uploadResult.url)
          : (videoPath = uploadResult.url);
      }
    }

    const data = {
      text,
      imagePath,
      videoPath,
      isSafe: true,
    };

    const response = await createPost(data);

    if (!response.success) {
      toast.error("Something went wrong.");
    } else {
      revalidatePost();
      toast.success("Post created successfully!");
    }

    setIsLoading(false);

    setText("");
    setSelectedMedia(null);
    setMediaType(undefined);

    if (response.success) {
      const aiResponse = await getTidbits({
        text,
        media_url,
      });

      if (aiResponse.success) {
        if (aiResponse.finish_reason == 1) {
          await updatePost({ tidbits: aiResponse.text }, response.post.id);
          revalidatePostUpdate();
        } else if (aiResponse.finish_reason == 3) {
          await updatePost({ isSafe: false }, response.post.id);
          revalidatePostUpdate();
        }
      }

      await addPostToCorpus({
        text,
        media_url,
        postId: response.post.id,
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{dialogButton}</AlertDialogTrigger>
      <AlertDialogContent className="max-w-[65rem] w-fit">
        <AlertDialogHeader>
          <div className="flex flex-col gap-2 items-center justify-center">
            <AlertDialogTitle>Create post</AlertDialogTitle>
            <AlertDialogDescription>
              Post to the stream from here. Click post when you're done.
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>
        <div className="space-y-6">
          <div className="space-y-4 flex items-center justify-center gap-4">
            <div className="relative">
              <TextArea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={`What's brewing, ${username}?`}
                className="h-40 w-[30rem] focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-gray-400"
              />
              <div
                className={`absolute right-1 top-0 -translate-y-3 translate-x-3 rounded-full p-1 text-xl cursor-pointer ${
                  isProofOn ? "text-emerald-600" : "text-rose-600"
                } bg-amber-200`}
                onClick={() => {
                  if (!isProofOn) {
                    setIsProofOn(true);
                    handleProofReading();
                  } else {
                    setIsProofOn(false);
                    setCorrectedText("");
                  }
                }}
              >
                {isProofOn ? (
                  <ProofReadingFilledIcon />
                ) : (
                  <ProofReadingLineIcon />
                )}
              </div>
            </div>

            {isProofOn && (
              <TextArea
                ref={scrollAreaRef}
                value={correctedText ? correctedText : "Thinking..."}
                onChange={(e) => setCorrectedText(e.target.value)}
                className="h-40 w-[30rem] focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-gray-400 -translate-y-2 resize-none"
              />
            )}
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
