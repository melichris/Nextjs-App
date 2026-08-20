"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { createPost } from "./actions";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Buttons";
import { FormGroup } from "@/components/ui/FormGroup";

// Disable Server-Side Rendering explicitly for the editor component
const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[350px] bg-bg-secondary border border-border-primary rounded-xl flex items-center justify-center text-text-tertiary font-mono text-xs animate-pulse">
      Loading workspace layout canvas...
    </div>
  ),
});

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

export default function NewPostPage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [slugEditedManually, setSlugEditedManually] = useState(false);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugEditedManually) {
      setSlug(slugify(value));
    }
  }

  return (
    <main className="section-pad max-w-3xl mx-auto">
      <Card>
        <form action={createPost}>
          <FormGroup
            title="Compose New Article"
            description="Type '/' to trigger modern block options. Drag, format, and structure with speed."
          >
            <Input
              label="Article Title"
              name="title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g., Block-Based Text Editors in Next.js"
              required
            />

            <Input
              label="URL Slug Custom Path"
              name="slug"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugEditedManually(true);
              }}
              placeholder="e.g., block-text-editors-nextjs"
              required
            />

            <div className="input-wrapper mb-4">
              <label className="block font-body text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                Post Content Body
              </label>

              {/* Dynamic Notion-Style Canvas Editor Component */}
              <RichTextEditor value={content} onChange={(html) => setContent(html)} />

              {/* The hidden variable that passes compiled HTML safely back to actions.tsx */}
              <input type="hidden" name="content" value={content} />
            </div>

            <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer select-none py-1">
              <input
                type="checkbox"
                name="published"
                defaultChecked
                className="accent-primary-brand h-4 w-4 rounded-sm border-border-secondary"
              />
              Publish immediately
            </label>

            <div className="flex-between pt-4 border-t border-border-primary mt-2">
              <Button type="submit" variant="primary">
                Publish Article
              </Button>
            </div>
          </FormGroup>
        </form>
      </Card>
    </main>
  );
}
