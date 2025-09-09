import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../contexts/ThemeProvider";
import AbstractProvider from "./AbstractProvider";
import { ContractProvider } from "../contexts/ContractContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Hotdogs Name Service - Abstract's Spiciest Web3 Domain Registry",
  description: "Claim your hotdog name — fast, cheap, and fun web3 domains!"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable}`}>
        <AbstractProvider>
          <ContractProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </ContractProvider>
        </AbstractProvider>
      </body>
    </html>
  );
}
