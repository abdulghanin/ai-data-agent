// app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AI Data Dashboard",
  description: "Upload, preview, and query your data with AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      {/* dark mode class can be toggled on this <html> */}
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-900 h-full`}>
        {/* Providers is a client component (React‑Query + Toast) */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
