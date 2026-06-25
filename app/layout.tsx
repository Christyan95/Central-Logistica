import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Using Inter for better premium look
import QueryProvider from "@/providers/QueryProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Central Logística HortSoy",
  description:
    "Sistema inteligente de gestão e geolocalização de filiais HortSoy - Otimização de rotas e logística avançada.",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/favicon.png" />
      </head>
      <body className={`${inter.variable}`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
