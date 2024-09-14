"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { Button } from "../ui/Button";
import Loading from "../common/Loading";
import PdfFilledIcon from "../icons/PdfFilledIcon";
import { toast } from "sonner";
import { addPdfToCorpus } from "@/actions/aiActions";
import { Slider } from "../ui/Slider";
import { Checkbox } from "../ui/Checkbox";
import { Label } from "../ui/Label";
import { TextArea } from "../ui/TextArea";
import { defaultSystemInstruction } from "./items/defaultSystemInstruction";
import MarkdownRenderer from "../common/MarkdownRenderer";

const PdfSubmissionField = ({
  userId,
}: {
  userId: number | null | undefined;
}) => {
  const [pdf, setPdf] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [temperature, setTemperature] = useState(0.8);
  const [topP, setTopP] = useState(0.8);
  const [topK, setTopK] = useState(60);

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
        <h1 className="flex justify-center text-xl text-slate-800 font-semibold mb-6">
          Train Your Custom Chatbot
        </h1>

        <div className="flex gap-10">
          {!pdf ? (
            <div className="flex flex-col w-1/2 mb-4 items-center justify-center border-2 border-dashed border-gray-300 p-6 rounded-lg">
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
            <div className="flex items-center justify-center mb-4 w-1/2">
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
        </div>

        <div>
          <div className="flex items-center space-x-2 mt-2 mb-4">
            <Checkbox
              id="advanced_settings"
              checked={showAdvanced}
              onCheckedChange={(checked: boolean) => setShowAdvanced(checked)}
            />
            <Label
              htmlFor="advanced_settings"
              className="text-sm text-slate-700 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Advanced Settings
            </Label>
          </div>

          <div className="font-semibold grid grid-cols-5 gap-4 w-1/2 text-slate-800">
            <div className="col-span-1 grid grid-rows-3 gap-2">
              <p
                className={`row-span-1 text-sm ${
                  !showAdvanced && "opacity-50"
                }`}
              >
                Temperature
              </p>
              <p
                className={`row-span-1 text-sm ${
                  !showAdvanced && "opacity-50"
                }`}
              >
                Top_p
              </p>
              <p
                className={`row-span-1 text-sm ${
                  !showAdvanced && "opacity-50"
                }`}
              >
                Top_k
              </p>
            </div>

            <div className="col-span-4 grid grid-rows-3 gap-2">
              <div className="flex gap-4 items-center">
                <Slider
                  className={`row-span-1 w-60 ${!showAdvanced && "opacity-50"}`}
                  value={[temperature]}
                  max={2}
                  step={0.01}
                  onValueChange={(value) => setTemperature(value[0])}
                  disabled={!showAdvanced}
                />
                <span
                  className={`flex justify-center text-sm bg-amber-300 w-10 rounded-full ${
                    !showAdvanced && "opacity-50"
                  }`}
                >
                  {temperature.toFixed(2)}
                </span>
              </div>

              <div className="flex gap-4 items-center">
                <Slider
                  className={`row-span-1 w-60 ${!showAdvanced && "opacity-50"}`}
                  value={[topP]}
                  max={1}
                  step={0.01}
                  onValueChange={(value) => setTopP(value[0])}
                  disabled={!showAdvanced}
                />
                <span
                  className={`flex justify-center text-sm bg-amber-300 w-10 rounded-full ${
                    !showAdvanced && "opacity-50"
                  }`}
                >
                  {topP.toFixed(2)}
                </span>
              </div>

              <div className="flex gap-4 items-center">
                <Slider
                  className={`row-span-1 w-60 ${
                    !showAdvanced ? "opacity-50" : ""
                  }`}
                  value={[topK]}
                  min={1}
                  max={100}
                  step={1}
                  onValueChange={(value) => setTopK(value[0])}
                  disabled={!showAdvanced}
                />
                <span
                  className={`flex justify-center text-sm bg-amber-300 w-10 rounded-full ${
                    !showAdvanced && "opacity-50"
                  }`}
                >
                  {topK}
                </span>
              </div>
            </div>
          </div>

          <div className="my-4 w-1/2 text-slate-800">
            <p
              className={`mb-2 text-sm font-semibold ${
                !showAdvanced && "opacity-50"
              }`}
            >
              System instruction
            </p>
            <TextArea
              className={`resize-none h-72 ${!showAdvanced && "opacity-50"}`}
              disabled={!showAdvanced}
              defaultValue={defaultSystemInstruction}
            />
          </div>
        </div>

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
