import { AppLink } from "./ui/AppLink";

interface PostCardProps {
  title: string;
  content: string;
  slug: string;
  authorName: string;
  createdAt: Date;
}

export function PostCard({ title, content, slug, authorName, createdAt }: PostCardProps) {
  const formattedDate = new Date(createdAt).toLocaleDateString();

  return (
    // "bg-bg-secondary" and "border-border-primary" implement your new tokens cleanly
    <article className="bg-bg-secondary border border-border-primary rounded-xl p-6 mb-6 transition-all hover:shadow-sm">
      <div className="flex items-center gap-2 font-mono text-xs text-text-tertiary">
        <span className="font-semibold text-text-secondary">{authorName}</span>
        <span>•</span>
        <time>{formattedDate}</time>
      </div>

      <h2 className="font-display font-semibold text-text-primary text-2xl mt-2 tracking-tight">
        <AppLink href={`/posts/${slug}`} className="hover:text-primary-brand transition-colors">
          {title}
        </AppLink>
      </h2>

      <p className="mt-3 text-text-secondary text-sm leading-relaxed line-clamp-3">
        {content}
      </p>

      <div className="mt-4 flex items-center justify-between">
        {/* Your new pill badge style in clean Tailwind v4 utility layout */}
        <span className="bg-primary-brand-soft text-primary-brand px-2.5 py-1 rounded-full text-xs font-medium">
          Article
        </span>

        <AppLink href={`/posts/${slug}`} className="text-xs font-mono font-bold uppercase tracking-wider text-primary-brand hover:underline">
          Read Post →
        </AppLink>
      </div>
    </article>
  );
}
