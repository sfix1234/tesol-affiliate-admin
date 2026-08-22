import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "アフィリエイト管理 | オンラインTESOL協会",
  description:
    "オンラインTESOL協会のインフルエンサー向けアフィリエイト管理ツール",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "'Noto Sans JP', system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
