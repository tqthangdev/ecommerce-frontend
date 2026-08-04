import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import ServerOfflineBanner from "@/components/common/ServerOfflineBanner"

export const metadata: Metadata = {
  title: "Ecommerce",
  description: "Ecommerce frontend",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ServerOfflineBanner />
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
