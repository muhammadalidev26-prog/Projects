"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function MarkdownEditor({ name, defaultValue = "" }: { name: string; defaultValue?: string }) {
  const [value, setValue] = useState(defaultValue);
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div>
        <label htmlFor={name} className="mb-1.5 block text-sm font-medium">Content (markdown)</label>
        <textarea id={name} name={name} value={value} onChange={(e) => setValue(e.target.value)} rows={18} className="input font-mono text-sm" />
      </div>
      <div>
        <p className="mb-1.5 text-sm font-medium">Preview</p>
        <div className="prose prose-invert max-h-[27rem] max-w-none overflow-y-auto rounded-md border border-line bg-surface p-4 prose-a:text-accent">
          <ReactMarkdown>{value || "Nothing to preview yet. Start writing on the left."}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
