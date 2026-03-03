"use client";

import { useState, useEffect, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  Heading4,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Loader2,
  Sparkles,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { slugify } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface PostFormData {
  title: string;
  slug: string;
  content: string;
  categoryId: string;
  tags: string;
  featuredImage: string;
  excerpt: string;
  published: boolean;
  featured: boolean;
  aiSummary: string;
}

interface PostEditorProps {
  initialData?: Partial<PostFormData>;
  onSubmit: (data: PostFormData) => void;
  isLoading: boolean;
  canFeature?: boolean;
}

export default function PostEditor({
  initialData,
  onSubmit,
  isLoading,
  canFeature = false,
}: PostEditorProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId ?? "");
  const [tags, setTags] = useState(initialData?.tags ?? "");
  const [featuredImage, setFeaturedImage] = useState(
    initialData?.featuredImage ?? ""
  );
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? "");
  const [published, setPublished] = useState(initialData?.published ?? false);
  const [featured, setFeatured] = useState(initialData?.featured ?? false);
  const [aiSummary, setAiSummary] = useState(initialData?.aiSummary ?? "");
  const [aiLoading, setAiLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image.configure({ inline: false }),
    ],
    content: initialData?.content ?? "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm dark:prose-invert max-w-none min-h-[300px] p-4 focus:outline-none",
      },
    },
  });

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const json = await res.json();
          const cats = json?.data ?? json;
          setCategories(Array.isArray(cats) ? cats : []);
        }
      } catch {
        // Categories will remain empty
      }
    }
    fetchCategories();
  }, []);

  const handleTitleChange = useCallback(
    (value: string) => {
      setTitle(value);
      if (!initialData?.slug) {
        setSlug(slugify(value));
      }
    },
    [initialData?.slug]
  );

  const handleGenerateAiSummary = async () => {
    const content = editor?.getHTML() ?? "";
    if (!content || content === "<p></p>") return;

    setAiLoading(true);
    try {
      const res = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (res.ok) {
        const json = await res.json();
        setAiSummary(json.data?.summary ?? json.summary ?? "");
      }
    } catch {
      // Failed to generate summary
    } finally {
      setAiLoading(false);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!slug.trim()) newErrors.slug = "Slug is required";
    const content = editor?.getHTML() ?? "";
    if (!content || content === "<p></p>")
      newErrors.content = "Content is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({
      title,
      slug,
      content: editor?.getHTML() ?? "",
      categoryId,
      tags,
      featuredImage,
      excerpt,
      published,
      featured,
      aiSummary,
    });
  };

  const ToolbarButton = ({
    onClick,
    active,
    children,
    title: btnTitle,
  }: {
    onClick: () => void;
    active?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={btnTitle}
      className={`p-2 rounded hover:bg-accent transition-colors ${
        active ? "bg-accent text-accent-foreground" : "text-muted-foreground"
      }`}
    >
      {children}
    </button>
  );

  const addLink = () => {
    const url = window.prompt("Enter URL:");
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt("Enter image URL:");
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Post title"
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title}</p>
        )}
      </div>

      {/* Slug */}
      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="post-slug"
        />
        {errors.slug && (
          <p className="text-sm text-destructive">{errors.slug}</p>
        )}
      </div>

      {/* Rich Text Editor */}
      <div className="space-y-2">
        <Label>Content</Label>
        <div className="rounded-md border border-input bg-background">
          {editor && (
            <div className="flex flex-wrap gap-1 border-b border-input p-2">
              <ToolbarButton
                title="Bold"
                onClick={() => editor.chain().focus().toggleBold().run()}
                active={editor.isActive("bold")}
              >
                <Bold className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                title="Italic"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                active={editor.isActive("italic")}
              >
                <Italic className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                title="Heading 2"
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
                active={editor.isActive("heading", { level: 2 })}
              >
                <Heading2 className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                title="Heading 3"
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
                active={editor.isActive("heading", { level: 3 })}
              >
                <Heading3 className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                title="Heading 4"
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 4 }).run()
                }
                active={editor.isActive("heading", { level: 4 })}
              >
                <Heading4 className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                title="Bullet List"
                onClick={() =>
                  editor.chain().focus().toggleBulletList().run()
                }
                active={editor.isActive("bulletList")}
              >
                <List className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                title="Ordered List"
                onClick={() =>
                  editor.chain().focus().toggleOrderedList().run()
                }
                active={editor.isActive("orderedList")}
              >
                <ListOrdered className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                title="Blockquote"
                onClick={() =>
                  editor.chain().focus().toggleBlockquote().run()
                }
                active={editor.isActive("blockquote")}
              >
                <Quote className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                title="Code Block"
                onClick={() =>
                  editor.chain().focus().toggleCodeBlock().run()
                }
                active={editor.isActive("codeBlock")}
              >
                <Code className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                title="Link"
                onClick={addLink}
                active={editor.isActive("link")}
              >
                <LinkIcon className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton title="Image" onClick={addImage}>
                <ImageIcon className="h-4 w-4" />
              </ToolbarButton>
            </div>
          )}
          <EditorContent editor={editor} />
        </div>
        {errors.content && (
          <p className="text-sm text-destructive">{errors.content}</p>
        )}
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label>Category</Label>
        <Select value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="nextjs, react, typescript"
        />
      </div>

      {/* Featured Image */}
      <div className="space-y-2">
        <Label htmlFor="featuredImage">Featured Image URL</Label>
        <Input
          id="featuredImage"
          value={featuredImage}
          onChange={(e) => setFeaturedImage(e.target.value)}
          placeholder="https://example.com/image.jpg"
        />
        {featuredImage && (
          <div className="mt-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={featuredImage}
              alt="Featured preview"
              className="h-32 w-auto rounded-md border object-cover"
            />
          </div>
        )}
      </div>

      {/* Excerpt */}
      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Brief description of the post..."
          rows={3}
        />
      </div>

      {/* Toggles */}
      <div className="flex flex-wrap gap-6">
        <div className="flex items-center gap-2">
          <Switch
            id="published"
            checked={published}
            onCheckedChange={setPublished}
          />
          <Label htmlFor="published">Published</Label>
        </div>
        {canFeature && (
          <div className="flex items-center gap-2">
            <Switch
              id="featured"
              checked={featured}
              onCheckedChange={setFeatured}
            />
            <Label htmlFor="featured">Featured</Label>
          </div>
        )}
      </div>

      {/* AI Summary */}
      <div className="space-y-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleGenerateAiSummary}
          disabled={aiLoading}
        >
          {aiLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Generate AI Summary
        </Button>
        {aiSummary && (
          <div className="rounded-md border bg-muted/50 p-4 text-sm">
            <p className="mb-1 font-medium text-muted-foreground">
              AI Summary
            </p>
            <p>{aiSummary}</p>
          </div>
        )}
        <input type="hidden" value={aiSummary} />
      </div>

      {/* Save */}
      <Button onClick={handleSubmit} disabled={isLoading} className="w-full">
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Save className="mr-2 h-4 w-4" />
        )}
        Save Post
      </Button>
    </div>
  );
}
