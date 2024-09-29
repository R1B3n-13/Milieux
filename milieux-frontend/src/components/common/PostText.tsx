"use client";

import { useMemo, useState } from "react";
import MarkdownRenderer from "./MarkdownRenderer";

const PostText = ({ text }: { text: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxVisualLength = 300;
  const newlineEquivalent = 50;

  const { truncatedText, isTruncatable } = useMemo(() => {
    let visualLength = 0;
    let truncationIndex = text.length;

    for (let i = 0; i < text.length; i++) {
      if (text[i] === "\n") {
        visualLength += newlineEquivalent;
      } else {
        visualLength += 1;
      }

      if (visualLength > maxVisualLength) {
        truncationIndex = i;
        break;
      }
    }

    return {
      truncatedText:
        truncationIndex < text.length
          ? text.slice(0, truncationIndex) + "..."
          : text,
      isTruncatable: truncationIndex < text.length,
    };
  }, [text, maxVisualLength, newlineEquivalent]);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <div className="px-6 text-slate-700 font-medium">
      <MarkdownRenderer text={isExpanded ? text : truncatedText} />
      {isTruncatable && (
        <button
          onClick={toggleExpand}
          className="text-blue-600 hover:text-blue-700 hover:underline font-semibold -translate-y-[0.35rem]"
        >
          {isExpanded ? "Read less" : "Read more"}
        </button>
      )}
    </div>
  );
};

export default PostText;
