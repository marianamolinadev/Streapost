import type { Metadata } from "next";
import { Suspense } from "react";
import { Poppins } from "next/font/google";
import Header from "@/app/components/common/Header";
import { ThemeProvider } from "@/app/components/common/ThemeProvider";
import { SWRProvider } from "@/app/components/common/SWRProvider";
import { OfflineBanner } from "@/app/components/common/OfflineBanner";
import { NavigationLoadingProvider } from "@/app/context/NavigationLoadingContext";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Streapost",
  description: "Streapost is a simple posts list explorer built with Next.js, Prisma, and SQLite.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SWRProvider>
            <NavigationLoadingProvider>
              <Suspense fallback={<header className="h-[72px] bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800" />}>
                <Header />
              </Suspense>
              {children}
              <OfflineBanner />
            </NavigationLoadingProvider>
          </SWRProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}