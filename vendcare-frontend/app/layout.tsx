import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AnimatePresence } from "framer-motion";
import MeshGradient from "./components/MeshGradient"; // Import your new component

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter" 
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ['italic', 'normal'],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "VendCare | Smart Dispenser",
  description: "Experience precision self-care. Securely purchase moisturizers, sunscreens, and perfumes via our minimalist vending interface.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`
        ${inter.variable} 
        ${playfair.variable} 
        font-sans 
        antialiased 
        text-[#4A3F3F] 
        flex 
        flex-col 
        min-h-screen 
        bg-[#0A0A0A] 
        selection:bg-[#0A0A0A]/30
      `}>
        
        {/* 1. The Interactive Background Layer */}
        <MeshGradient />

        {/* 2. Main Application Content */}
        <AnimatePresence mode="wait">
          <main className="relative z-10 flex-grow flex flex-col">
            {children}
          </main>
        </AnimatePresence>
        
      </body>
    </html>
  );
}