import type { Metadata } from "next";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import SupabaseProvider from "@/lib/supabase/SupabaseProvider";
import ScrollToTop from "@/components/scrollToTop";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "ZC-TASK",
  description: "Manage your tasks and projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${montserrat.className}`}>
          <SupabaseProvider>
            <Navbar />
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
            <main className="pt-5 bg-zinc-50 min-h-screen">
              <ScrollToTop>{children}</ScrollToTop>
            </main>
          </SupabaseProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
