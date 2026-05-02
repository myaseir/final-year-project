import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Using Inter for its precise, architectural legibility
const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter" 
});

export const metadata: Metadata = {
  title: "VendCare Professional | Smart IoT Dispensing",
  description: "An automated, IoT-powered ecosystem for premium skincare and fragrances by Glacia Labs.",
  // Professional touch: defining the viewport to prevent auto-zoom on inputs in iOS
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body 
        className={`
          ${inter.variable} 
          font-sans 
          antialiased 
          text-[#4A3F3F] 
          bg-white 
          selection:bg-[#F3C5C5] 
          selection:text-[#4A3F3F] 
          flex flex-col 
          min-h-screen
        `}
      >
        {/* 
            The main wrapper is set to bg-white to ensure that even 
            during page transitions or on mobile devices with overscroll, 
            the 'VendCare' aesthetic remains bright and clean.
        */}
        <main className="flex-grow flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}