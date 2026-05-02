import type { Metadata } from "next";
import { Orbitron, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/hooks/use-theme";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VisionX Iraq | Autonomous Emergency Operations Center",
  description: "Futuristic Command Center Dashboard for Al-Nahrain University Design Day 2026",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased font-inter">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
