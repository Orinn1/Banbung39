import type { Metadata } from "next";
import { Inter, Anton } from "next/font/google";
import "./globals.css";
import PageLoader from "@/components/PageLoader";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BANBUNG39",
  description: "Official House of BANBUNG39 - By.Mike Winterfel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${anton.variable} dark`}>
      <body className="min-h-screen bg-[#060709] text-[#F3F4F6] font-sans antialiased selection:bg-white selection:text-black overflow-x-hidden">
        <PageLoader />
        {children}
      </body>
    </html>
  );
}
