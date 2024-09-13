import React, { useState, useEffect } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";

const MarkdownRenderer: React.FC<{ text: string }> = ({ text }) => {
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    const parseMarkdown = async () => {
      const rawMarkup = await marked(text, {
        breaks: true,
        gfm: true,
      });

      const cleanHtml = DOMPurify.sanitize(rawMarkup);
      setHtml(cleanHtml);
    };

    parseMarkdown();
  }, [text]);

  return (
    <div
      className="markdown-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default MarkdownRenderer;
