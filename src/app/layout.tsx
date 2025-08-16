import type { Metadata } from "next";
import { Press_Start_2P, VT323, Inter, Sora, Pixelify_Sans, Silkscreen } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./ThemeProvider";

const pressStart2P = Press_Start_2P({
  variable: "--font-press-start",
  subsets: ["latin"],
  weight: "400",
});

const vt323 = VT323({
  variable: "--font-vt323",
  subsets: ["latin"],
  weight: "400",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const pixelifySans = Pixelify_Sans({
  variable: "--font-pixelify",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const silkscreen = Silkscreen({
  variable: "--font-silkscreen",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "HotDog Name Service - Abstract's Spiciest Web3 Domain Registry",
  description: "The first naming service built on Abstract blockchain. Claim your hotdog name — fast, cheap, and fun web3 domains!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${pressStart2P.variable} ${vt323.variable} ${inter.variable} ${sora.variable} ${pixelifySans.variable} ${silkscreen.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
