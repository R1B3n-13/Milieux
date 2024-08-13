"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { Button } from "../ui/Button";
import Loading from "../common/Loading";
import PdfFilledIcon from "../icons/PdfFilledIcon";
import { toast } from "sonner";
import { addPdfToCorpus } from "@/actions/aiActions";

const PdfSubmissionField = ({
  userId,
}: {
  userId: number | null | undefined;
}) => {
  const [pdf, setPdf] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPdf(e.target.files?.[0] || null);
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    if (pdf) {
      const formData = new FormData();
      formData.append("pdf", pdf);
      formData.append("userId", String(userId));

      const uploadResult = await addPdfToCorpus(formData);

      if (!uploadResult.success) {
        toast.error("Upload failed.");
        setIsLoading(false);
        return;
      } else {
        toast.success("Upload successful!");
      }
    }

    setIsLoading(false);
    setPdf(null);
  };

  return (
    <div className="h-full w-full">
      <div className="bg-white p-6 rounded-lg shadow-md w-full">
        <h1 className="text-xl text-slate-700 font-semibold mb-4">
          Train Your Custom Chatbot
        </h1>

        {!pdf ? (
          <div className="flex flex-col mb-4 items-center justify-center border-2 border-dashed border-gray-300 p-6 rounded-lg">
            <input
              id="pdf-input"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <label
              htmlFor="pdf-input"
              className="cursor-pointer text-blue-600 text-lg"
            >
              Click here to select a pdf
            </label>
          </div>
        ) : (
          <div className="flex items-center justify-center mb-4">
            <div className="w-fit relative">
              <div className="flex items-center justify-center text-5xl text-slate-800 pr-7 gap-1">
                <PdfFilledIcon />
                <p className="text-base text-ellipsis cursor-default">
                  {pdf.name}
                </p>
              </div>
              <button
                className="absolute top-0 right-0 px-1 rounded-full bg-rose-500 text-white text-sm cursor-pointer"
                onClick={() => {
                  setPdf(null);
                }}
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={isLoading || !pdf}>
            {isLoading ? <Loading text="Loading..." /> : "Upload"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PdfSubmissionField;
