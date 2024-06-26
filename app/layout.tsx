import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { cn } from "@/lib/utils";
import { Header } from "./headers";

const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: "NoteScape",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" >
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
        )}
      >
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
