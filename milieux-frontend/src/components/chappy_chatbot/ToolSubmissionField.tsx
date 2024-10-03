"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { Button } from "../ui/Button";
import Loading from "../common/Loading";
import PdfFilledIcon from "../icons/PdfFilledIcon";
import { toast } from "sonner";
import { createAiTool, updateAiTool } from "@/actions/aiActions";
import { Slider } from "../ui/Slider";
import { Checkbox } from "../ui/Checkbox";
import { Label } from "../ui/Label";
import { TextArea } from "../ui/TextArea";
import { getAiTool } from "@/services/aiService";
import { z } from "zod";
import {
  revalidateAiTool,
  revalidateAiToolUpdate,
} from "@/actions/revalidationActions";
import CircleQuestionIcon from "../icons/CircleQuestionIcon";
import { defaultSystemInstructionForTool } from "./items/defaultSystemInstructionForTool";
import AiToolSchema from "@/schemas/aiToolSchema";
import { useChatBotContext } from "./ChatBotContextProvider";

const ToolSubmissionField = ({
  userId,
}: {
  userId: number | null | undefined;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [temperature, setTemperature] = useState(1);
  const [topP, setTopP] = useState(0.95);
  const [topK, setTopK] = useState(64);
  const [currentFileName, setCurrentFileName] = useState("");
  const [systemInstruction, setSystemInstruction] = useState(
    defaultSystemInstructionForTool
  );

  const { triggerRefresh, setTriggerRefresh } = useChatBotContext();

  let aiToolParams: z.infer<typeof AiToolSchema> = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    systemInstruction: defaultSystemInstructionForTool,
  };

  useEffect(() => {
    const initAiTool = async () => {
      const response = await getAiTool(userId);

      if (response.success) {
        aiToolParams = response.aiTool;
        setTemperature(aiToolParams.temperature || 1);
        setTopP(aiToolParams.topP || 0.95);
        setTopK(aiToolParams.topK || 64);
        setCurrentFileName(aiToolParams.currentFileName || "None");
        setSystemInstruction(
          aiToolParams.systemInstruction || defaultSystemInstructionForTool
        );
      }
    };

    initAiTool();
  }, [isLoading]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    const formData = new FormData();

    if (file) {
      formData.append("fileData", file);
      formData.append("currentFileName", file.name);
    } else if (currentFileName) {
      formData.append("currentFileName", currentFileName);
    }

    formData.append("temperature", temperature.toString());
    formData.append("topP", topP.toString());
    formData.append("topK", topK.toString());
    formData.append("systemInstruction", systemInstruction);

    let response;

    if (file && !currentFileName) {
      response = await createAiTool(formData);
    } else if (showAdvanced || file) {
      response = await updateAiTool(formData);
    }

    if (response && !response.success) {
      toast.error(response.message || "Operation failed.");
      setIsLoading(false);
      return;
    }

    toast.success(
      !currentFileName
        ? "Successfully created AI tool!"
        : "AI tools updated successfully!"
    );

    setTriggerRefresh(!triggerRefresh);
    setIsLoading(false);
    setFile(null);
    revalidateAiTool();
    revalidateAiToolUpdate();
  };

  return (
    <>
      <div className="flex items-center mb-4 text-slate-800 text-sm">
        <p className="font-semibold mr-1">Current Tool : </p>
        <p className="text-amber-700">{currentFileName}</p>
      </div>

      <div className="flex gap-10">
        {!file ? (
          <div className="flex flex-col w-full mb-4 items-center justify-center border-2 border-dashed border-gray-300 p-6 rounded-lg">
            <input
              id="py-input"
              type="file"
              accept=".py"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <label
              htmlFor="py-input"
              className="cursor-pointer text-blue-600 text-lg"
            >
              Click here to select a python file
            </label>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full mb-4">
            <div className="w-fit relative">
              <div className="flex items-center justify-center text-5xl text-slate-800 pr-7 gap-1">
                <PdfFilledIcon />
                <p className="text-base text-ellipsis cursor-default">
                  {file.name}
                </p>
              </div>
              <button
                className="absolute top-0 right-0 px-1 rounded-full bg-rose-500 text-white text-sm cursor-pointer"
                onClick={() => {
                  setFile(null);
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
            id="advanced_settings_tool"
            checked={showAdvanced}
            onCheckedChange={(checked: boolean) => setShowAdvanced(checked)}
          />
          <Label
            htmlFor="advanced_settings_tool"
            className="text-sm text-slate-700 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Advanced Settings
          </Label>
        </div>

        <div className="font-semibold grid grid-cols-5 gap-4 text-slate-800">
          <div className="col-span-1 grid grid-rows-3 gap-2">
            <p
              className={`row-span-1 text-sm ${!showAdvanced && "opacity-50"}`}
            >
              Temperature
            </p>
            <p
              className={`row-span-1 text-sm ${!showAdvanced && "opacity-50"}`}
            >
              Top_p
            </p>
            <p
              className={`row-span-1 text-sm ${!showAdvanced && "opacity-50"}`}
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

        <div className="my-4 text-slate-800">
          <p
            className={`mb-2 text-sm font-semibold ${
              !showAdvanced && "opacity-50"
            }`}
          >
            System Instruction
          </p>
          <TextArea
            className={`resize-none h-72 ${!showAdvanced && "opacity-50"}`}
            disabled={!showAdvanced}
            value={systemInstruction}
            onChange={(e) => setSystemInstruction(e.target.value)}
          />
        </div>
      </div>

      <a
        href="https://ai.google.dev/gemini-api/docs/function-calling/tutorial?lang=python"
        className="text-blue-500 flex items-center gap-1 text-sm"
      >
        <CircleQuestionIcon />
        Please refer to this site for more information.
      </a>

      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={(isLoading || !file) && !showAdvanced}
        >
          {isLoading ? <Loading text="Loading..." /> : "Add"}
        </Button>
      </div>
    </>
  );
};

export default ToolSubmissionField;
