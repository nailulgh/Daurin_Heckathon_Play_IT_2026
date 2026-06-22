import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";
import AppShell from "@/components/layout/AppShell";
import { Toaster } from "@/components/ui/toaster";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Daurin - Sustainability Marketplace",
  description: "Marketplace daur ulang sampah dan bahan baku industri berkelanjutan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextAuthProvider>
          <AppShell>
            {children}
          </AppShell>
          <Toaster />
        </NextAuthProvider>
      </body>
    </html>
  );
}
