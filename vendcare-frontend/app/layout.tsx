import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Using Inter for a clean, modern, readable interface
const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter" 
});

export const metadata: Metadata = {
  title: "VendCare | Smart Dispenser",
  description: "Quickly and securely purchase your favorite moisturizers, sunscreens, and perfumes via our smart UPI vending interface.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      {/* Removed the hardcoded background color from the layout 
        because our individual pages handle their own background colors.
      */}
      <body className={`${inter.variable} font-sans antialiased text-gray-900 flex flex-col min-h-screen`}>
        <main className="flex-grow">{children}</main>
      </body>
    </html>
  );
}