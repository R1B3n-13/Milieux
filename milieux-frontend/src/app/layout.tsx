import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/Sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Milieux: Your Social Sphere, Redefined",
  description:
    "Redefining social connection by seamlessly bringing people, communities, and shared experiences together in one vibrant platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main className="bg-[#f8f8f8]">{children}</main>
        <Toaster richColors />
      </body>
    </html>
  );
}
