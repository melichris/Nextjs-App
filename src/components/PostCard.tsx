// import Link from "next/link";

// type PostCardProps = {
//   slug: string;
//   title: string;
//   content: string;
//   authorName: string;
//   createdAt: Date;
// };

// export function PostCard({ slug, title, content, authorName, createdAt }: PostCardProps) {
//   return (
//     <Link
//       href={`/posts/${slug}`}
//       className="block rounded-lg border border-gray-200 p-6 hover:border-gray-300 hover:shadow-sm transition"
//     >
//       <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
//       <p className="mt-2 text-gray-600 line-clamp-2">{content}</p>
//       <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
//         <span>{authorName}</span>
//         <span>·</span>
//         <time>{createdAt.toLocaleDateString()}</time>
//       </div>
//     </Link>
//   );
// }

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
    <article className="rounded-lg border border-gray-200 p-6 hover:border-gray-300 hover:shadow-sm transition">
      <Link href={`/posts/${slug}`}>
        <h2 className="text-xl font-semibold text-gray-900 hover:underline">
          {title}
        </h2>
        <p className="mt-2 text-gray-600 line-clamp-2">{content}</p>
      </Link>
      <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
        <Link href={`/author/${authorUsername}`} className="hover:underline">
          {authorName}
        </Link>
        <span>·</span>
        <time>{createdAt.toLocaleDateString()}</time>
      </div>
    </article>
  );
}
