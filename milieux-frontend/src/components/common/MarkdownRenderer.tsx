import React, { useState, useEffect } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";

const MarkdownRenderer: React.FC<{ text: string }> = ({ text }) => {
  const [html, setHtml] = useState("");

  useEffect(() => {
    const parseMarkdown = async () => {
      const rawMarkup = await marked(text, {
        breaks: true,
        gfm: true,
      });
      const cleanHtml = DOMPurify.sanitize(rawMarkup);
      const htmlWithHighlightedHashtags = highlightHashtags(cleanHtml);
      setHtml(htmlWithHighlightedHashtags);
    };

    parseMarkdown();
  }, [text]);

  const highlightHashtags = (html: string) => {
    const regex = /(#\w+)/g;
    return html.replace(
      regex,
      '<span class="text-blue-500 italic hover:underline cursor-pointer">$1</span>'
    );
  };

  return (
    <div
      className="markdown-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default MarkdownRenderer;
