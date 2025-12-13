import type { Metadata } from "next";
import { Josefin_Sans } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/app-shell";
import { ThemeProvider } from "@/components/theme-provider";

// Josefin Sans fontunu yükle
const josefinSans = Josefin_Sans({
  subsets: ["latin"],
  variable: "--font-josefin",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Metrekare | İstanbul Gayrimenkul Değerleme",
  description:
    "Makine öğrenmesi ile İstanbul konut piyasasında gerçek değeri keşfedin. Adil fiyat analizi ve yatırım tavsiyesi.",
  keywords: [
    "emlak",
    "gayrimenkul",
    "değerleme",
    "istanbul",
    "konut",
    "yatırım",
    "fiyat analizi",
  ],
  authors: [{ name: "Metrekare" }],
  openGraph: {
    title: "Metrekare | İstanbul Gayrimenkul Değerleme",
    description:
      "Makine öğrenmesi ile İstanbul konut piyasasında gerçek değeri keşfedin.",
    type: "website",
    locale: "tr_TR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${josefinSans.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}

