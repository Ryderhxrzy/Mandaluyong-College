import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import PublicLayoutShell from "@/components/PublicLayoutShell";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MCST - Mandaluyong College of Science and Technology",
  description: "Excellence in Education, Leadership, and Innovation. Explore our programs and admissions at Mandaluyong College.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased overflow-x-hidden`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PublicLayoutShell>
            {children}
          </PublicLayoutShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
