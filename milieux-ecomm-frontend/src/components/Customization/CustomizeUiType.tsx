"use client";

import { useStoreContext } from "@/contexts/StoreContext";
import React, { useState } from "react";
import { Button } from "../ui/button";
import Image from "next/image";

const CustomizeUiType = () => {
  const { storeInfo, setStoreInfo, loading, authToken } = useStoreContext();
  const [uiType, setUiType] = useState(0);
  const carouselPath =
    "https://res.cloudinary.com/dify5wcxm/image/upload/v1726766330/ibxbsj4qpckmmvpuiuwm.png";
  const staticImagePath =
    "https://res.cloudinary.com/dify5wcxm/image/upload/v1726767655/osruln7kmmtat0jkamz4.png";
  const [error, setError] = useState<string | null>(null);

  const PORT = process.env.ECOMM_BACKEND_URL || "http://localhost:8082/api";

  const updateStoreUiType = async () => {
    try {
      const response = await fetch(
        `${PORT}/store/update/ui-type/${storeInfo.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ ui_type: uiType }),
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Store not found");
        } else {
          throw new Error("Failed to update store UI");
        }
      }

      // After successful UI update, update the StoreContext with the new UI type
      setStoreInfo((prevStoreInfo: any) => ({
        ...prevStoreInfo,
        ui_type: uiType,
      }));
    } catch (error: any) {
      console.error("Error updating store UI:", error);
      setError(error.message || "Failed to update store UI");
    }
  };

  return (
    <>
      <div className="flex justify-center items-center h-full">
        <div
          className="flex flex-col w-max h-max p-5 justify-center items-center gap-10 
                rounded-3xl border-[1.5px] border-gray-200 shadow-2xl shadow-gray-200 "
        >
          <p>Please select a layout</p>

          <div className="flex w-[90%] gap-5 justify-center items-center bg-white">
            <Button
              variant={"ghost"}
              onClick={() => setUiType(2)}
              className="w-[300px] h-[300px] p-0"
              style={{
                backgroundColor: uiType === 2 ? "#e6e6e6e6" : "#FFFFFF",
              }}
            >
              <div className="flex flex-col border-[1.5px] border-gray-200 rounded-2xl justify-center items-center w-full h-full">
                <Image
                  src={carouselPath}
                  alt="carousel"
                  width={200}
                  height={200}
                  className="w-[200px] h-[200px] object-cover"
                />
                <p>Carousel</p>
              </div>
            </Button>

            <Button
              variant={"ghost"}
              onClick={() => setUiType(1)}
              className="w-[300px] h-[300px] p-0"
              style={{
                backgroundColor: uiType === 1 ? "#e6e6e6e6" : "#FFFFFF",
              }}
            >
              <div className="flex flex-col border-[1.5px] border-gray-200 rounded-2xl justify-center items-center w-full h-full">
                <Image
                  src={staticImagePath}
                  alt="static images"
                  width={200}
                  height={200}
                  className="w-[200px] h-[200px]"
                />
                <p>Static Images</p>
              </div>
            </Button>
          </div>

          <Button
            onClick={updateStoreUiType}
            variant={"ghost"}
            className="bg-black text-white hover:bg-gray-800 hover:text-white"
          >
            Confirm
          </Button>
        </div>
      </div>
    </>
  );
};

export default CustomizeUiType;
