import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: '%s | DevBoards',
    default: 'DevBoards - Find the Perfect Development Board',
  },
  description: 'Discover and compare ESP32, microcontroller, and IoT development boards. Find detailed specifications, features, and pricing to choose the perfect board for your next project.',
  keywords: ['ESP32', 'development board', 'microcontroller', 'IoT', 'Arduino', 'embedded systems', 'prototyping'],
  openGraph: {
    title: 'DevBoards - Find the Perfect Development Board',
    description: 'Discover and compare ESP32, microcontroller, and IoT development boards. Find detailed specifications, features, and pricing to choose the perfect board for your next project.',
    type: 'website',
    siteName: 'DevBoards',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DevBoards - Find the Perfect Development Board',
    description: 'Discover and compare ESP32, microcontroller, and IoT development boards.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.className} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
