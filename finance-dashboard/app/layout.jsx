import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "FinAI - AI Financial Assistant",
  description: "Your personalized AI-powered finance platform.",
};

import { AuthProvider } from "@/context/AuthContext";
import { SearchProvider } from "@/context/SearchContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-[oklch(0.145_0_0)] text-[oklch(0.985_0_0)] antialiased selection:bg-[oklch(0.50_0.20_250)] selection:text-white`}>
        <AuthProvider>
          <SearchProvider>
            {children}
          </SearchProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
