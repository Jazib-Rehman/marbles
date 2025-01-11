import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Open_Sans } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { TalentProvider } from "@/context/TalentContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${openSans.className} antialiased`}>
        <AuthProvider>
          <TalentProvider>
          {children}
          </TalentProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
