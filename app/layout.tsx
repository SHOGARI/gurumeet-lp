import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const title = "GuruMeet | 「何食べる？」を、みんなのスワイプで決める。";
const description =
  "もう「なんでもいい」で迷わない。グループ全員でスワイプして、その場で今日の一軒が決まる。";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  keywords: ["GuruMeet", "グルミート", "飲食店", "グループ", "投票", "スワイプ"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: SITE_URL,
    siteName: "GuruMeet",
    title,
    description,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "GuruMeet" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fffaf7",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className="scroll-smooth">
      <body className={`${geist.variable} antialiased`}>{children}</body>
    </html>
  );
}
