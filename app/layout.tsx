import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthInitializer } from "@/lib/authInitializer";
import { Toaster } from "sonner";
import NetworkStatusListener from "@/components/layouts/NetworkStatus";
import {Analytics} from "@vercel/analytics/react"

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "schedU - Votre planning étudiant",
  description: "Consultez facilement votre programme de cours hebdomadaire avec schedU.",
  manifest: "/manifest.json",
  themeColor: "#16a34a",
  icons: {
    icon: "/icons/icon192x192.png",
    apple: "/icons/icon192x192.png", // pour iOS
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        {/* fallback pour certaines balises pas encore couvertes par metadata */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#16a34a" />
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
          <Toaster 
            closeButton 
            theme="light"
            position="top-center"
          />
          {children}
          <Analytics/>
        </ThemeProvider>
      </body>
    </html>
  );
}
