import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Poppins } from "next/font/google";
import Header from "@/app/components/common/Header";
import { ThemeProvider } from "@/app/components/common/ThemeProvider";
import { SWRProvider } from "@/app/components/common/SWRProvider";
import { OfflineBanner } from "@/app/components/common/OfflineBanner";
import { RegisterPWA } from "@/app/components/common/RegisterPWA";
import { NavigationLoadingProvider } from "@/app/context/NavigationLoadingContext";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const BRAND_COLOR = "#ff6900";

export const metadata: Metadata = {
  title: "Streapost",
  description: "Streapost is a simple posts list explorer built with Next.js, Prisma, and PostgreSQL.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Streapost",
  },
};

export const viewport: Viewport = {
  themeColor: BRAND_COLOR,
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
          <RegisterPWA />
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