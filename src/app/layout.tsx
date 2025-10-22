import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { CartProvider } from "@/lib/cart-context";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "MobileShop - Premium Mobile Phones in Pakistan",
  description: "Your trusted destination for premium mobile phones in Pakistan. We offer the latest smartphones with genuine warranties and fast delivery.",
  keywords: "mobile phones, smartphones, Pakistan, iPhone, Samsung, OnePlus, Google Pixel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
