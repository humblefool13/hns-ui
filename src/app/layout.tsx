import type { Metadata } from "next";
import { Inter, Sora, Bungee_Shade } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from './ThemeProvider';
import AbstractProvider from './AbstractProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const sora = Sora({ subsets: ['latin'], variable: '--font-sora' });
const bungeeShade = Bungee_Shade({ 
  weight: '400', 
  subsets: ['latin'], 
  variable: '--font-bungee-shade' 
}); 

export const metadata: Metadata = {
  title: "HotDog Name Service - Abstract's Spiciest Web3 Domain Registry",
  description: "Claim your hotdog name — fast, cheap, and fun web3 domains!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${sora.variable} ${bungeeShade.variable} font-inter`}>
        <AbstractProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AbstractProvider>
      </body>
    </html>
  );
}
