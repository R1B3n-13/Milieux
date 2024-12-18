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
  generateCaption,
  generateImage,
  getTidbits,
} from "@/actions/aiActions";
import BulbLineIcon from "../icons/BulbLineIcon";
import BulbFilledIcon from "../icons/BulbFilledIcon";
import { readStreamableValue } from "ai/rsc";
import ImageCaptionFilledIcon from "../icons/ImageCaptionFilledIcon";
import ImageCaptionLineIcon from "../icons/ImageCaptionLineIcon";
import RedoIcon from "../icons/RedoIcon";
import AiPicFilledIcon from "../icons/AiPicFilledIcon";
import SendFilledIcon from "../icons/SendFilledIcon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";
import { aiModelItems } from "./items/aiModelItems";
import convertToBase64 from "@/utils/convertToBase64";
import base64ToFile from "@/utils/base64ToFile";

export default function PostSubmissionDialog({
  dialogButton,
  username,
}: {
  dialogButton: JSX.Element;
  username: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [isLoading3, setIsLoading3] = useState(false);
  const [isLoading4, setIsLoading4] = useState(false);
  const [text, setText] = useState<string>("");
  const [isBulbOn, setIsBulbOn] = useState(false);
  const [isCaptionOn, setIsCaptionOn] = useState(false);
  const [isAiPicOn, setIsAiPicOn] = useState(false);
  const [promptForPicGen, setPromptForPicGen] = useState("");
  const [selectedModel, setSelectedModel] = useState<string | undefined>(
    undefined
  );
  const [selectedMedia, setSelectedMedia] = useState<
    string | ArrayBuffer | null
  >(null);
  const [media, setMedia] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | undefined>(
    undefined
  );
  const [aiText, setAiText] = useState("");
  const scrollAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleAiCall = async (id: string) => {
    if (isCaptionOn) {
      if (!media) return;

      id === "bulb" ? setIsLoading3(true) : setIsLoading4(true);

      const formData = new FormData();
      formData.append("text", text ? String(text) : "Generate a caption.");
      formData.append("media", media);

      const { result, success } = await generateCaption(formData);

      if (!success) {
        toast.error("Something went wrong. Please try again.");
      }

      let textStream = "";

      for await (const delta of readStreamableValue(result)) {
        textStream += delta;
        setAiText(textStream);
      }

      id === "bulb" ? setIsLoading3(false) : setIsLoading4(false);
    } else {
      if (text.trim() === "") return;

      id === "bulb" ? setIsLoading3(true) : setIsLoading4(true);

      const data = {
        text,
      };

      const { result, success } = await checkAndCorrectText(data);

      if (!success) {
        toast.error("Something went wrong. Please try again.");
      }

      let textStream = "";

      for await (const delta of readStreamableValue(result)) {
        textStream += delta;
        setAiText(textStream);
      }

      id === "bulb" ? setIsLoading3(false) : setIsLoading4(false);
    }
  };

  const handleImageGen = async () => {
    if (isAiPicOn) {
      if (
        promptForPicGen.trim() === "" ||
        selectedModel?.trim() === "" ||
        !selectedModel
      ) {
        return;
      }

      setIsLoading2(true);

      const data = {
        text: promptForPicGen,
        model: selectedModel,
      };

      const response = await generateImage(data);

      let imageFile: File | null;

      if (response.success) {
        convertToBase64(response.image_url)
          .then((base64Image) => {
            imageFile = base64ToFile(
              base64Image as string,
              "image.jpg",
              "image/jpeg"
            );
            setSelectedMedia(base64Image as string);
            setMediaType("image");
          })
          .then(() => setMedia(imageFile))
          .catch(() => toast.error("Unknown error occurred."));
      } else {
        toast.error("Image generation failed.");
      }

      setIsLoading2(false);
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [aiText]);

  const handleMediaChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const fileType = file.type.startsWith("video") ? "video" : "image";
      setMediaType(fileType);
      setMedia(file);

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
    setMedia(null);
  };

  const clearAll = () => {
    setSelectedMedia(null);
    setMediaType(undefined);
    setText("");
    setAiText("");
    setMedia(null);
    setIsBulbOn(false);
    setIsCaptionOn(false);
    setIsAiPicOn(false);
    setPromptForPicGen("");
    setSelectedModel(undefined);
    setIsLoading(false);
    setIsLoading2(false);
    setIsLoading3(false);
    setIsLoading4(false);
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
      await revalidatePost();
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
          await revalidatePostUpdate();
        } else if (aiResponse.finish_reason == 3) {
          await updatePost({ isSafe: false }, response.post.id);
          await revalidatePostUpdate();
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
              Post to the stream from here. Click post when you&apos;re done.
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>
        <div className="space-y-6">
          <div className="flex items-center justify-center gap-4">
            <div className="relative">
              <TextArea
                ref={scrollAreaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={
                  isCaptionOn
                    ? "Request for a caption..."
                    : `What's brewing, ${username}?`
                }
                className="h-40 w-[30rem] focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-gray-400"
              />
              <div
                className={`absolute right-1 top-0 -translate-y-3 translate-x-3 rounded-full p-1 text-xl cursor-pointer ${
                  isBulbOn ? "text-emerald-600" : "text-rose-600"
                }  bg-amber-200`}
                onClick={() => {
                  if (!isBulbOn) {
                    setIsBulbOn(true);
                    handleAiCall("bulb");
                  } else {
                    setIsBulbOn(false);
                    setAiText("");
                  }
                }}
              >
                <div className={`${isLoading3 && "animate-pulse"}`}>
                  {isBulbOn ? <BulbFilledIcon /> : <BulbLineIcon />}
                </div>
              </div>
            </div>

            {isBulbOn && (
              <div className="relative">
                <TextArea
                  ref={scrollAreaRef}
                  value={aiText ? aiText : "Thinking..."}
                  onChange={(e) => setAiText(e.target.value)}
                  className="h-40 w-[30rem] focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-gray-400 resize-none"
                />
                <div
                  className="absolute right-1 top-0 -translate-y-3 translate-x-3 rounded-full p-1 text-xl cursor-pointer text-indigo-500 bg-amber-200 "
                  onClick={() => handleAiCall("re")}
                >
                  <div className={`${isLoading4 && "animate-spin"}`}>
                    <RedoIcon />
                  </div>
                </div>
              </div>
            )}
          </div>

          {isAiPicOn && (
            <>
              <div className="flex justify-center items-center">
                <TextArea
                  value={promptForPicGen}
                  onChange={(e) => setPromptForPicGen(e.target.value)}
                  placeholder="Write your prompt..."
                  className="min-h-10 h-10 pr-10 focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-gray-400 rounded-full resize-none no-scrollbar"
                />
                <Button
                  disabled={!promptForPicGen || !selectedModel}
                  className="p-2 -ml-11 text-slate-800 bg-inherit border-none shadow-none hover:bg-inherit"
                  onClick={handleImageGen}
                >
                  {isLoading2 ? <Loading text="" /> : <SendFilledIcon />}
                </Button>
              </div>

              <div className="flex items-center justify-center">
                <Select
                  onValueChange={(str) => setSelectedModel(str)}
                  value={selectedModel}
                >
                  <SelectTrigger className="w-48 rounded-full">
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    {aiModelItems.map((model) => (
                      <SelectItem key={model.value} value={model.value}>
                        {model.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {selectedMedia && (
            <div className="flex items-center justify-center relative">
              {mediaType === "image" ? (
                <div className="w-fit flex items-center justify-center gap-4">
                  <div className="relative">
                    <Image
                      src={selectedMedia as string}
                      alt=""
                      width={220}
                      height={220}
                      className="rounded-lg"
                    />
                    <button
                      className="absolute top-1 right-1 px-1 rounded-sm bg-red-500 text-white text-sm cursor-pointer"
                      onClick={clearMedia}
                    >
                      ✕
                    </button>
                  </div>

                  <div
                    className={`text-3xl ${
                      isCaptionOn ? "text-emerald-600" : "text-gray-800"
                    }  cursor-pointer p-2 rounded-full hover:bg-gray-100`}
                    onClick={() => setIsCaptionOn(!isCaptionOn)}
                  >
                    {isCaptionOn ? (
                      <ImageCaptionFilledIcon />
                    ) : (
                      <ImageCaptionLineIcon />
                    )}
                  </div>
                </div>
              ) : (
                <div className="w-fit max-w-72 flex items-center justify-center gap-4">
                  <div className="relative rounded-lg overflow-hidden">
                    <VideoPlayer
                      src={selectedMedia as string}
                      width={200}
                      className="w-full h-full rounded-lg"
                      controls={false}
                      autoPlay={false}
                    />
                    <button
                      className="absolute top-1 right-1 px-1 rounded-sm bg-red-500 text-white text-sm cursor-pointer"
                      onClick={clearMedia}
                    >
                      ✕
                    </button>
                  </div>

                  <div
                    className={`text-3xl ${
                      isCaptionOn ? "text-emerald-600" : "text-gray-800"
                    }  cursor-pointer p-2 rounded-full hover:bg-gray-100`}
                    onClick={() => setIsCaptionOn(!isCaptionOn)}
                  >
                    {isCaptionOn ? (
                      <ImageCaptionFilledIcon />
                    ) : (
                      <ImageCaptionLineIcon />
                    )}
                  </div>
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

            <div
              className="flex rounded-lg w-full p-2 items-center justify-center cursor-pointer gap-2 hover:bg-muted text-2xl text-emerald-600"
              onClick={() => setIsAiPicOn(!isAiPicOn)}
            >
              <AiPicFilledIcon />
              <p className="text-base font-semibold text-slate-700">
                AI Pic/Ad
              </p>
            </div>
          </div>

          <AlertDialogFooter>
            <div className="flex justify-end gap-4">
              <AlertDialogCancel onClick={clearAll}>Cancel</AlertDialogCancel>
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
