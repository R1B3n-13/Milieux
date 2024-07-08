"use client";

import { Button } from "@/components/ui/Button";
import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "../ui/Form";
import Loading from "./Loading";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { Textarea } from "../ui/Textarea";
import ImageFilledIcon from "../icons/ImageFilledIcon";
import Image from "next/image";
import CloseFilledIcon from "../icons/CloseFilledIcon";
import uploadToCloudinary from "@/actions/cloudinaryActions";
import CommentSchema from "@/schemas/commentSchema";
import SendFilledIcon from "../icons/SendFilledIcon";
import { createComment } from "@/actions/commentAction";
import { revalidateComment } from "@/actions/revalidationActions";

export default function CommentForm({
  postId,
}: {
  postId: number | undefined;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<
    string | ArrayBuffer | null
  >(null);

  const form = useForm<z.infer<typeof CommentSchema>>({
    resolver: zodResolver(CommentSchema),
    defaultValues: {
      text: undefined,
      imagePath: undefined,
    },
  });

  const { setValue } = form;

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const fReader = new FileReader();
      fReader.readAsDataURL(file);

      fReader.onloadend = function (event) {
        const result = event.target?.result;
        if (result) {
          setSelectedImage(result);
          setValue("imagePath", result as string);
        }
      };
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setValue("imagePath", undefined);
  };

  const onSubmit = async (data: z.infer<typeof CommentSchema>) => {
    setIsLoading(true);

    if (selectedImage) {
      const uploadResult = await uploadToCloudinary(selectedImage as string);

      if (!uploadResult.success) {
        toast.error("Upload failed.");
        setIsLoading(false);
        return;
      } else {
        data.imagePath = uploadResult.url || "";
      }
    }

    const response = await createComment(data, postId);

    if (!response.success) {
      toast.error("Something went wrong.");
    } else {
      toast.success("Remark added successfully!");
    }

    setIsLoading(false);

    setSelectedImage(null);

    form.reset({ text: "", imagePath: "" });

    revalidateComment();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex items-center space-x-2">
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Add your remark..."
                    className="resize-none no-scrollbar pl-7"
                    style={{ border: "none" }}
                  />
                </FormControl>
                <FormMessage className="flex justify-center pb-2" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="imagePath"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <>
                    <input
                      id="image-input-comment"
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        handleImageChange(event);
                        field.onChange(event);
                      }}
                      style={{ display: "none" }}
                    />
                    <FormLabel htmlFor="image-input-comment">
                      <div className="cursor-pointer text-gray-500 text-lg">
                        <ImageFilledIcon />
                      </div>
                    </FormLabel>
                  </>
                </FormControl>
              </FormItem>
            )}
          />
          <div className="pr-5 pl-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="text-black px-2"
              variant="ghost"
            >
              {isLoading ? (
                <Loading text="" />
              ) : (
                <div>
                  <SendFilledIcon />
                </div>
              )}
            </Button>
          </div>
        </div>

        {selectedImage && (
          <div className="flex items-center justify-center pb-3">
            <div className="relative">
              <Image
                src={selectedImage as string}
                alt=""
                width={200}
                height={200}
              />
              <div
                className="absolute top-0 right-0 cursor-pointer"
                onClick={clearImage}
              >
                <div className="text-red-800">
                  <CloseFilledIcon />
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </Form>
  );
}
