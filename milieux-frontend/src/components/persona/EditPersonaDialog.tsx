"use client";

import { useState, ChangeEvent } from "react";
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
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import Image from "next/image";
import uploadToCloudinary from "@/actions/cloudinaryActions";
import { ScrollArea } from "../ui/ScrollArea";
import { updateUser } from "@/actions/userActions";
import { toast } from "sonner";
import { revalidateUser } from "@/actions/revalidationActions";
import Loading from "../common/Loading";

const EditPersonaDialog = ({ dialogButton }: { dialogButton: JSX.Element }) => {
  const [isLoading, setIsLoading] = useState(false);

  const initialEditData = {
    name: "",
    dp: "",
    banner: "",
    status: "",
    intro: "",
    address: "",
  };
  const [editData, setEditData] = useState(initialEditData);

  const [selectedDp, setSelectedDp] = useState<string | ArrayBuffer | null>(
    null
  );
  const [selectedBanner, setSelectedBanner] = useState<
    string | ArrayBuffer | null
  >(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value,
    });
  };

  const handleImageChange = (
    e: ChangeEvent<HTMLInputElement>,
    type: "dp" | "banner"
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = function (event) {
        const result = event.target?.result;
        if (result) {
          if (type === "dp") {
            setSelectedDp(result);
          } else {
            setSelectedBanner(result);
          }
        }
      };
    }
  };

  const clearImage = (type: "dp" | "banner") => {
    if (type === "dp") {
      setSelectedDp(null);
    } else {
      setSelectedBanner(null);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    if (selectedDp) {
      const uploadResult = await uploadToCloudinary(
        selectedDp as string,
        "image"
      );

      if (!uploadResult.success) {
        console.error("Upload failed.");
        return;
      } else {
        editData.dp = uploadResult.url as string;
      }
    }

    if (selectedBanner) {
      const uploadResult = await uploadToCloudinary(
        selectedBanner as string,
        "image"
      );

      if (!uploadResult.success) {
        console.error("Upload failed.");
        return;
      } else {
        editData.banner = uploadResult.url as string;
      }
    }

    const response = await updateUser(editData);

    if (!response.success) {
      toast.error("Something went wrong.");
    } else {
      toast.success("Persona edited successfully!");
    }

    setIsLoading(false);

    setEditData(initialEditData);

    revalidateUser();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{dialogButton}</AlertDialogTrigger>
      <AlertDialogContent className="w-full max-w-lg">
        <AlertDialogHeader className="flex items-center justify-center">
          <AlertDialogTitle>Edit Your Persona</AlertDialogTitle>
          <AlertDialogDescription>
            Update the fields below and click save when you're done.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <ScrollArea className="max-h-[80vh] p-3">
          <div className="space-y-4">
            <div>
              <Input
                name="name"
                value={editData.name}
                onChange={handleChange}
                placeholder="Name"
              />
            </div>

            <div>
              <Textarea
                name="status"
                value={editData.status}
                onChange={handleChange}
                placeholder="Status"
                className="h-24"
              />
            </div>

            <div>
              <Textarea
                name="intro"
                value={editData.intro}
                onChange={handleChange}
                placeholder="Intro"
                className="h-24"
              />
            </div>

            <div>
              <Input
                name="address"
                value={editData.address}
                onChange={handleChange}
                placeholder="Address"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Input
              id="dp-input"
              type="file"
              accept="image/*"
              onChange={(event) => handleImageChange(event, "dp")}
              style={{ display: "none" }}
            />
            <label
              htmlFor="dp-input"
              className="flex items-center justify-center cursor-pointer gap-2 hover:bg-muted"
            >
              <div className="text-blue-600">
                {selectedDp ? (
                  <Image
                    src={selectedDp as string}
                    alt=""
                    width={200}
                    height={200}
                    className="rounded-lg"
                  />
                ) : (
                  <span>Select Display Picture</span>
                )}
              </div>
            </label>
            {selectedDp && (
              <button
                className="px-1 rounded-sm bg-red-500 text-white text-sm cursor-pointer"
                onClick={() => clearImage("dp")}
              >
                ✕
              </button>
            )}
          </div>

          <div className="space-y-2">
            <Input
              id="banner-input"
              type="file"
              accept="image/*"
              onChange={(event) => handleImageChange(event, "banner")}
              style={{ display: "none" }}
            />
            <label
              htmlFor="banner-input"
              className="flex items-center justify-center cursor-pointer gap-2 hover:bg-muted"
            >
              <div className="text-blue-600">
                {selectedBanner ? (
                  <Image
                    src={selectedBanner as string}
                    alt=""
                    width={200}
                    height={200}
                    className="rounded-lg"
                  />
                ) : (
                  <span>Select Banner</span>
                )}
              </div>
            </label>
            {selectedBanner && (
              <button
                className="px-1 rounded-sm bg-red-500 text-white text-sm cursor-pointer"
                onClick={() => clearImage("banner")}
              >
                ✕
              </button>
            )}
          </div>
        </ScrollArea>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            onClick={handleSubmit}
            disabled={
              isLoading ||
              Object.keys(editData).every((key) => {
                const editDataKey = key as keyof typeof editData;
                const initialEditDataKey = key as keyof typeof initialEditData;
                return (
                  editData[editDataKey] ===
                    initialEditData[initialEditDataKey] &&
                  !selectedBanner &&
                  !selectedDp
                );
              })
            }
          >
            {isLoading ? <Loading text="Loading..." /> : "Save changes"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EditPersonaDialog;