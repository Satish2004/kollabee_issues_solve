import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Script from "next/script";
import { PropsWithChildren } from "react";
import React from "react"; // Add this line

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Marketplace",
  description: "A modern marketplace for buyers and sellers",
};


export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-primary`}>

            {children}
            <Toaster position="top-center" />
        <Script
          src="https://example.com/script.js"
          strategy="lazyOnload"
          />
      </body>
    </html>
  );
}