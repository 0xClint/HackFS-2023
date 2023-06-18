"use client";
import { MoralisProvider } from "react-moralis";
import "./globals.css";
import { Inter } from "next/font/google";
import Context from "../context/context";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Context>
        <MoralisProvider initializeOnMount={false}>
          <body className={inter.className}>{children}</body>
        </MoralisProvider>
      </Context>
    </html>
  );
}
