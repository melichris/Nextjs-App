import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blog Platform",
  description: "A fullstack blog built with Next.js, Prisma, and PostgreSQL",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
