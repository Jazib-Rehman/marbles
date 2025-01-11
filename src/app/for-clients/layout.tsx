import Footer from "@/components/Footer";
import { Header } from "@/components/Header";
import Link from "next/link";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Header />
      <div className="flex justify-center w-full">{children}</div>
      <Footer />
    </div>
  );
}
