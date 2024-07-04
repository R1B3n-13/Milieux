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
import PostSchema from "@/schemas/postSchema";
import { createPost } from "@/actions/postActions";
import { Textarea } from "../ui/Textarea";
import ImageFilledIcon from "../icons/ImageFilledIcon";
import VideoFilledIcon2 from "../icons/VideoFilledIcon2";
import { Input } from "../ui/Input";
import Image from "next/image";
import CloseFilledIcon from "../icons/CloseFilledIcon";
import uploadToCloudinary from "@/actions/cloudinaryActions";

export default function PostCreationDialog({
  dialogButton,
  username,
}: {
  dialogButton: JSX.Element;
  username: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
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
        setSelectedImage(event.target?.result || "");
      };
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
  };

  const handleVideoChange = () => {};

  const form = useForm<z.infer<typeof PostSchema>>({
    resolver: zodResolver(PostSchema),

    defaultValues: {
      caption: undefined,
      imagePath: undefined,
      videoPath: undefined,
    },
  });

  const onSubmit = async (data: z.infer<typeof PostSchema>) => {
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

    if (selectedVideo) {
      const uploadResult = await uploadToCloudinary(selectedVideo as string);

      if (!uploadResult.success) {
        toast.error("Upload failed.");
        setIsLoading(false);
        return;
      } else {
        data.videoPath = uploadResult.url || "";
      }
    }

    const response = await createPost(data);

    if (!response.success) {
      toast.error(response.message);
    } else {
      toast.success(response.message);
    }

    setIsLoading(false);
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="caption"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder={`What's brewing, ${username}?`}
                        className="h-40"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
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

            <div className="flex p-0 m-0 items-center justify-center gap-3 text-xl text-slate-700">
              <FormField
                control={form.control}
                name="imagePath"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex rounded-lg w-full p-2 items-center justify-center cursor-pointer gap-2 hover:bg-muted">
                        <Input
                          id="image-input"
                          type="file"
                          accept="image/*"
                          onChange={(event) => {
                            handleImageChange(event);
                            field.onChange(event);
                          }}
                          style={{ display: "none" }}
                        />
                        <FormLabel htmlFor="image-input">
                          <div className="flex items-center justify-center gap-2 cursor-pointer">
                            <div className="text-blue-600">
                              <ImageFilledIcon />
                            </div>
                            <p className="text-base font-semibold">Image</p>
                          </div>
                        </FormLabel>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="videoPath"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex rounded-lg w-full p-2 items-center justify-center cursor-pointer gap-2 hover:bg-muted">
                        <Input
                          {...field}
                          id="video-input"
                          type="file"
                          accept="video/*"
                          onChange={handleVideoChange}
                          style={{ display: "none" }}
                        />
                        <FormLabel htmlFor="video-input">
                          <div className="flex items-center justify-center gap-2 cursor-pointer">
                            <div className="text-rose-600">
                              <VideoFilledIcon2 />
                            </div>
                            <p className="text-base font-semibold">Video</p>
                          </div>
                        </FormLabel>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loading text="Loading..." /> : "Post"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
