"use client";

import { useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/Button";
import { TextArea } from "@/components/ui/TextArea";
import ImageFilledIcon from "../icons/ImageFilledIcon";
import Image from "next/image";
import SendFilledIcon from "../icons/SendFilledIcon";
import Loading from "./Loading";
import { toast } from "sonner";
import uploadToCloudinary from "@/actions/cloudinaryActions";
import { createRemark } from "@/actions/remarkActions";
import { revalidateRemark } from "@/actions/revalidationActions";
import AddRemarkIcon from "../icons/AddRemarkIcon";

export default function RemarkSubmissionField({ postId }: { postId: number }) {
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState<{ [key: number]: string }>({});
  const [selectedImage, setSelectedImage] = useState<{
    [key: number]: string | ArrayBuffer | null;
  }>({});

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>,
    postId: number
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const fReader = new FileReader();
      fReader.readAsDataURL(file);

      fReader.onloadend = function (event) {
        const result = event.target?.result;
        if (result) {
          setSelectedImage((prev) => ({ ...prev, [postId]: result }));
        }
      };
    }
  };

  const clearImage = (postId: number) => {
    setSelectedImage((prev) => ({ ...prev, [postId]: null }));
  };

  const handleSubmit = async (postId: number) => {
    setIsLoading(true);

    let imagePath = null;

    if (selectedImage[postId]) {
      const uploadResult = await uploadToCloudinary(
        selectedImage[postId] as string,
        "image"
      );

      if (!uploadResult.success) {
        toast.error("Upload failed.");
        setIsLoading(false);
        return;
      } else {
        imagePath = uploadResult.url;
      }
    }

    const commentData = {
      text: text[postId],
      imagePath,
    };

    const response = await createRemark(commentData, postId);

    if (!response.success) {
      toast.error("Something went wrong.");
    } else {
      toast.success("Remark added successfully!");
    }

    setIsLoading(false);
    setText((prev) => ({ ...prev, [postId]: "" }));
    setSelectedImage((prev) => ({ ...prev, [postId]: null }));
    revalidateRemark();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="flex items-center flex-1 space-x-2">
          <div className="ml-4 -translate-y-3 text-slate-600 text-2xl rounded-full p-1 bg-gray-200">
            <AddRemarkIcon />
          </div>

          <TextArea
            value={text[postId] || ""}
            onChange={(e) =>
              setText((prev) => ({ ...prev, [postId]: e.target.value }))
            }
            placeholder="Add your remark..."
            className="resize-none no-scrollbar flex-1 pl-0 focus-visible:ring-0"
            style={{ border: "none" }}
          />
        </div>

        <div>
          <input
            id={`image-input-${postId}`}
            type="file"
            accept="image/*"
            onChange={(event) => handleImageChange(event, postId!)}
            style={{ display: "none" }}
          />
          <label
            htmlFor={`image-input-${postId}`}
            className="cursor-pointer text-slate-700 text-lg"
          >
            <ImageFilledIcon />
          </label>
        </div>

        <div className="pr-5 pl-2">
          <Button
            onClick={() => handleSubmit(postId!)}
            disabled={isLoading || (!text[postId] && !selectedImage[postId])}
            className="text-black px-2"
            variant="ghost"
          >
            {isLoading ? <Loading text="" /> : <SendFilledIcon />}
          </Button>
        </div>
      </div>

      {selectedImage[postId] && (
        <div className="flex items-center justify-center pb-3">
          <div className="relative">
            <Image
              src={selectedImage[postId] as string}
              alt=""
              width={200}
              height={200}
              className="rounded-lg"
            />
            <button
              className="absolute top-1 right-1 px-1 rounded-sm bg-red-500 text-white text-sm cursor-pointer"
              onClick={() => clearImage(postId!)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
