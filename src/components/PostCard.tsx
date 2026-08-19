import Link from "next/link";

type PostCardProps = {
  slug: string;
  title: string;
  content: string;
  authorName: string;
  authorUsername: string;
  createdAt: Date;
};

export function PostCard({
  slug,
  title,
  content,
  authorName,
  authorUsername,
  createdAt,
}: PostCardProps) {
  return (
    <article className="py-6 border-b border-line">
      <p className="font-mono text-xs uppercase tracking-wider text-ink-muted mb-2">
        <Link href={`/author/${authorUsername}`} className="hover:text-accent transition">
          {authorName}
        </Link>
        <span className="mx-2">·</span>
        <time>{createdAt.toLocaleDateString()}</time>
      </p>

      <Link href={`/posts/${slug}`}>
        <h2 className="font-display text-2xl font-medium text-ink hover:text-accent transition">
          {title}
        </h2>
      </Link>

      <p className="mt-2 text-ink-muted leading-relaxed line-clamp-2">{content}</p>
    </article>
  );
}
