import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cinnamon Table",
  description: "Restaurant ordering and tracking for guests.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-soft-milk text-espresso-black">
        <CartProvider>
          <div className="flex min-h-screen flex-col">
            <header className="border-b border-cream bg-white/90 backdrop-blur-xl">
              <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-muted-beige">Guest Menu</p>
                  <h1 className="text-2xl font-semibold text-espresso-black">Cinnamon Table</h1>
                </div>
                <div className="rounded-full bg-pastel-apricot px-4 py-2 text-sm font-semibold text-espresso-black shadow-cinnamon">
                  
                </div>
              </div>
            </header>

            <main className="flex-1">{children}</main>

            <footer className="border-t border-cream bg-white/90 px-4 py-6 text-sm text-muted-beige sm:px-6">
              <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p>Enjoy warm, effortless ordering from your table.</p>
                <p>Need help? Ask staff for your table token.</p>
              </div>
            </footer>
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
