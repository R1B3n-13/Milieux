import React, { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";

type EnlargeableImageWrapperProps = {
  children: React.ReactElement;
};

const EnlargeableImageWrapper: React.FC<EnlargeableImageWrapperProps> = ({
  children,
}) => {
  const enlargedChild = React.cloneElement(children, {
    style: {
      ...children.props.style,
      width: "100%",
      height: "auto",
      objectFit: "contain",
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-auto h-auto max-w-[95vw] max-h-[95vh] p-0 overflow-auto no-scrollbar border-[2.7px] border-amber-100">
        <div className="relative inline-block p-0 m-0">
          <DialogTrigger asChild>
            <button className="absolute top-3 right-3 px-1 rounded-sm bg-red-500 text-white text-sm cursor-pointer z-10">
              ✕
            </button>
          </DialogTrigger>
          {enlargedChild}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnlargeableImageWrapper;
