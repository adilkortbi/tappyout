import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Cart } from "@/components/layout/cart";
import { ThemeProvider } from "@/lib/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { HashScroll } from "@/components/utils/hash-scroll";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Tappy Out - Premium Digital Business Cards",
  description: "Revolutionize your networking with premium digital business cards. Share your contact information instantly with a simple tap.",
  keywords: ["business cards", "networking", "contact sharing", "digital cards"],
  authors: [{ name: "Tappy Out" }],
  openGraph: {
    title: "Tappy Out - Premium Digital Business Cards",
    description: "Revolutionize your networking with premium digital business cards.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tappy Out - Premium Digital Business Cards",
    description: "Revolutionize your networking with premium digital business cards.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          <div className="relative min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <Cart />
            <Toaster />
            <HashScroll />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
