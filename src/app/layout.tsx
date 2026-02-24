import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AIGC Wiki - AI图片参数展示",
  description: "展示AI生成图片及其详细参数",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
