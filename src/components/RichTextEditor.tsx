'use client';

import React, { useEffect, useState } from "react";
import { BlockNoteEditor } from "@blocknote/core";
import { useCreateBlockNote, useEditorChange } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn"; // Fixed Import Source
import "@blocknote/shadcn/style.css"; // Fixed Style Reference

interface RichTextEditorProps {
  value: string;
  onChange: (htmlContent: string) => void;
}

export default function RichTextEditor({ onChange }: RichTextEditorProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Sync editor theme with your local document .dark classes
  useEffect(() => {
    const checkDark = () => setIsDarkMode(document.documentElement.classList.contains("dark"));
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // Initialize the core BlockNote Editor Instance
  const editor: BlockNoteEditor = useCreateBlockNote();

  // Safely intercept mutations and convert block matrices to plain HTML strings
  useEditorChange(() => {
    const convertBlocks = async () => {
      const html = await editor.blocksToFullHTML();
      onChange(html);
    };
    convertBlocks();
  }, editor);

  return (
    <div className="w-full border border-border-primary rounded-xl bg-bg-secondary p-2 min-h-[350px] shadow-xs focus-within:border-primary-brand focus-within:ring-2 focus-within:ring-primary-brand-soft/50 transition-all">
      <BlockNoteView
        editor={editor}
        theme={isDarkMode ? "dark" : "light"}
      />
    </div>
  );
}
