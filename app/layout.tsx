import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "\u304a\u77e5\u3089\u305b CMS",
  description:
    "\u516c\u5f0f\u30b5\u30a4\u30c8\u306e\u304a\u77e5\u3089\u305b\u8868\u793a\u3068\u7ba1\u7406\u753b\u9762 CMS"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
