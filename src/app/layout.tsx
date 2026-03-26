import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "SmartXpense — Finance Tracker",
  description: "Know where every dollar goes",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "SmartXpense — Finance Tracker",
    description: "Know where every dollar goes",
    siteName: "SmartXpense",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "SmartXpense — Finance Tracker",
    description: "Know where every dollar goes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <QueryProvider>
          <ToastProvider>{children}</ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
