import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/contexts/StoreContext";
import { ShoppingCartProvider } from "@/contexts/ShoppingCartContext";
import { Toaster } from "@/components/ui/toaster";
import Nav from "@/components/Nav";

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

    <StoreProvider>
      <ShoppingCartProvider>
        <html lang="en">
          <head>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link rel="stylesheet" href="path-to-your-globals.css" />
            <link rel="icon" href="/icon.png" sizes="any" />
          </head>
          <body className={inter.className}>
            <div className="relative h-screen">
              <Nav />
              {children}
            </div>
            <Toaster />
          </body>
        </html>
      </ShoppingCartProvider>
    </StoreProvider>

  );
}
