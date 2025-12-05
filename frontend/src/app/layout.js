import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GlobalLayout from "@/components/SplashScreen/GlobalLayout";
import NextTopLoader from 'nextjs-toploader';
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "LogPack",
  description: "Detector de peso",
};

import { ThemeProvider } from "@/Themes/themeProvider"

export default function RootLayout({ children }) {
  return (
    <>
      <html lang="pt-br" suppressHydrationWarning>
        <head />
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NextTopLoader
              color="#d15700"
              initialPosition={0.08}
              crawlSpeed={200}
              height={3}
              crawl={true}
              showSpinner={false}
              easing="ease"
              speed={200}
              shadow="0 0 10px #2299DD,0 0 5px #2299DD"
            />

            <GlobalLayout>

              {children}
            </GlobalLayout>
          </ThemeProvider>
        </body>
      </html>
    </>
  )
}