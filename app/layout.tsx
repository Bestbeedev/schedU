
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthInitializer } from "@/lib/authInitializer";
import { Toaster } from "sonner";
import NetworkStatusListener from "@/components/layouts/NetworkStatus";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthInitializer />
          <NetworkStatusListener/>
          <Toaster position="top-center"/>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
