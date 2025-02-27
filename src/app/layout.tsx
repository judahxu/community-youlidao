import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { initRedis } from '@/server/redis'

import { TRPCReactProvider } from "~/trpc/react";
import { SessionProvider } from 'next-auth/react';

export const metadata: Metadata = {
  title: "AI尤里岛 - 专业AI新闻社区平台",
  description: "一站式AI行业动态、工具导航与专业社区，为AI从业者和爱好者提供优质资讯与交流平台",
  keywords: "AI新闻, 人工智能, AI工具, AI社区, 技术社群, AI教程, 深度学习",
  authors: [{ name: "AI尤里岛团队" }],
  creator: "AI尤里岛",
  publisher: "AI尤里岛",
  robots: "index, follow",
  themeColor: "#2563EB", // 使用品牌规范中的主色
  viewport: "width=device-width, initial-scale=1",
};

// 初始化Redis连接
if (process.env.NODE_ENV !== 'development') {
  initRedis().catch((err) => {
    console.error('Failed to initialize Redis:', err)
  })
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SessionProvider>
      <html lang="en" className={`${GeistSans.variable}`}>
        <body>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
