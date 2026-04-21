import type { Metadata } from "next";
import "./globals.css";
import { Geist, Geist_Mono, Inter, Figtree, Roboto } from "next/font/google";
import localFont from "next/font/local";
import { AuthProvider } from '../contexts/AuthContext';
import NextTopLoader from "nextjs-toploader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const satoshi = localFont({
  src: [
    {
      path: "../assets/fonts/Satoshi-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/Satoshi-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/Satoshi-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../assets/fonts/Satoshi-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IDCL Admin",
  description: "Imo Digital City Limited — Admin Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${satoshi.variable} ${roboto.variable} ${figtree.variable} ${inter.variable} ${geistMono.variable} antialiased`}
      >
        <NextTopLoader />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
