"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { Button } from "../ui/Button";
import Loading from "../common/Loading";
import PdfFilledIcon from "../icons/PdfFilledIcon";
import { toast } from "sonner";
import { addPdfToCorpus, createAiChatParams } from "@/actions/aiActions";
import { Slider } from "../ui/Slider";
import { Checkbox } from "../ui/Checkbox";
import { Label } from "../ui/Label";
import { TextArea } from "../ui/TextArea";
import { defaultSystemInstruction } from "./items/defaultSystemInstruction";
import AiChatParamsSchema from "@/schemas/aiChatParamsSchema";
import { getAiChatParams } from "@/services/aiService";
import { z } from "zod";
import { revalidateAiChatParams } from "@/actions/revalidationActions";
import ExpandLessIcon from "../icons/ExpandLessIcon";
import ExpandMoreIcon from "../icons/ExpandMoreIcon";
import CircleQuestionIcon from "../icons/CircleQuestionIcon";
import ToolSubmissionField from "./ToolSubmissionField";
import { useChatBotContext } from "./ChatBotContextProvider";

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
  const [currentPdfName, setCurrentPdfName] = useState("");
  const [systemInstruction, setSystemInstruction] = useState(
    defaultSystemInstruction
  );
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(false);

  const { triggerRefresh, setTriggerRefresh } = useChatBotContext();

  let aiChatParams: z.infer<typeof AiChatParamsSchema> = {
    temperature: 0.8,
    topP: 0.8,
    topK: 60,
    systemInstruction: defaultSystemInstruction,
  };

  useEffect(() => {
    const initAiChatParams = async () => {
      const response = await getAiChatParams(userId);

      if (response.success) {
        aiChatParams = response.aiChatParams;
        setTemperature(aiChatParams.temperature || 0.8);
        setTopP(aiChatParams.topP || 0.8);
        setTopK(aiChatParams.topK || 60);
        setCurrentPdfName(aiChatParams.currentPdfName || "None");
        setSystemInstruction(
          aiChatParams.systemInstruction || defaultSystemInstruction
        );
      }
    };

    initAiChatParams();
  }, [isLoading]);

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
        toast.success("Pdf Uploaded successfully!");

        const data = {
          currentPdfName: pdf.name,
          temperature,
          topP: topP,
          topK: topK,
          systemInstruction: systemInstruction,
        };

        const response = await createAiChatParams(data);

        if (response.success) {
          toast.success("Params updated successfully!");
          revalidateAiChatParams();
        } else {
          toast.error("Couldn't update params. Try again.");
        }
      }
    } else if (showAdvanced) {
      const data = {
        currentPdfName: null,
        temperature,
        topP: topP,
        topK: topK,
        systemInstruction: systemInstruction,
      };

      const response = await createAiChatParams(data);

      if (response.success) {
        toast.success("Params updated successfully!");
        revalidateAiChatParams();
      } else {
        toast.error("Couldn't update params. Try again.");
      }
    }

    setTriggerRefresh(!triggerRefresh);
    setIsLoading(false);
    setPdf(null);
  };

  return (
    <div className="min-h-fit">
      <div
        onClick={() => setIsSettingsExpanded(!isSettingsExpanded)}
        className="flex items-center gap-1 text-slate-800 font-semibold mb-4 cursor-pointer"
      >
        <div className="text-xl">
          {isSettingsExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </div>
        {isSettingsExpanded ? (
          <span>Hide Settings Options</span>
        ) : (
          <span>Expand Settings Options</span>
        )}
      </div>
      {isSettingsExpanded && (
        <div className="h-fit w-full grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white p-6 rounded-lg shadow-md w-full col-span-1">
            <h1 className="flex justify-center text-xl text-slate-800 font-semibold mb-6">
              Train Your Custom Chatbot
            </h1>

            <div className="flex items-center mb-4 text-slate-800 text-sm">
              <p className="font-semibold mr-1">Current Pdf : </p>
              <p className="text-amber-700">{currentPdfName}</p>
            </div>

            <div className="flex gap-10">
              {!pdf ? (
                <div className="flex flex-col w-full mb-4 items-center justify-center border-2 border-dashed border-gray-300 p-6 rounded-lg">
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
                <div className="flex items-center justify-center w-full mb-4">
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
                  onCheckedChange={(checked: boolean) =>
                    setShowAdvanced(checked)
                  }
                />
                <Label
                  htmlFor="advanced_settings"
                  className="text-sm text-slate-700 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Advanced Settings
                </Label>
              </div>

              <div className="font-semibold grid grid-cols-5 gap-4 text-slate-800">
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
                      className={`row-span-1 w-60 ${
                        !showAdvanced && "opacity-50"
                      }`}
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
                      className={`row-span-1 w-60 ${
                        !showAdvanced && "opacity-50"
                      }`}
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

              <div className="my-4 text-slate-800">
                <p
                  className={`mb-2 text-sm font-semibold ${
                    !showAdvanced && "opacity-50"
                  }`}
                >
                  System Instruction
                </p>
                <TextArea
                  className={`resize-none h-72 ${
                    !showAdvanced && "opacity-50"
                  }`}
                  disabled={!showAdvanced}
                  value={systemInstruction}
                  onChange={(e) => setSystemInstruction(e.target.value)}
                />
              </div>
            </div>

            <a
              href="https://ai.google.dev/gemini-api/docs/models/generative-models#model-parameters"
              className="text-blue-500 flex items-center gap-1 text-sm"
            >
              <CircleQuestionIcon />
              Please refer to this site for more information.
            </a>

            <div className="flex justify-end">
              <Button
                onClick={handleSubmit}
                disabled={(isLoading || !pdf) && !showAdvanced}
              >
                {isLoading ? <Loading text="Loading..." /> : "Train"}
              </Button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md w-full col-span-1">
            <h1 className="flex justify-center text-xl text-slate-800 font-semibold mb-6">
              Add Tool to Your Chatbot
            </h1>

            <ToolSubmissionField userId={userId} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfSubmissionField;
