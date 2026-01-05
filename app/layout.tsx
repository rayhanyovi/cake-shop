import type { Metadata } from "next";
import { Montserrat, Rozha_One } from "next/font/google";
import "./globals.css";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import { AuthProvider } from "@/src/context/AuthContext";
import { CartAnchorProvider } from "@/src/context/CartAnchorContext";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const rozhaOne = Rozha_One({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Cake Shop",
  description: "Cake Shop",
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E%F0%9F%8D%B0%3C/text%3E%3C/svg%3E",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${rozhaOne.variable} *:antialiased`}
      >
        <div id="app-root">
          <AuthProvider>
            <CartAnchorProvider>
              <div className="min-h-screen bg-transparent flex flex-col">
                <Navbar />
                <main className="flex-1 flex flex-col">{children}</main>
                <Footer />
              </div>
            </CartAnchorProvider>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
