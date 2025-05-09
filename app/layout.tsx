import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthInitializer } from "@/lib/authInitializer";
import { Toaster } from "sonner";
import NetworkStatusListener from "@/components/layouts/NetworkStatus";
import { Analytics } from "@vercel/analytics/react";
import { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

// Configure ta font
const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "700", "800", "900"],
  variable: "--font-inter",
});

// ✅ Metadata sans themeColor
export const metadata: Metadata = {
  title: "schedU - Votre planning étudiant",
  description:
    "Consultez facilement votre programme de cours hebdomadaire avec schedU.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon192x192.png",
    apple: "/icons/icon192x192.png",
  },
};

// ✅ themeColor déplacé ici
export const viewport: Viewport = {
  themeColor: "#16a34a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={inter.className} suppressHydrationWarning>
      <head>
        {/* fallback facultatif */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon192x192.png" />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthInitializer />
          <NetworkStatusListener />
          <Toaster closeButton theme="light" position="top-center" />
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
