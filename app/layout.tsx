import type { Metadata } from "next";
import { Pixelify_Sans, Fira_Code } from "next/font/google";
import LoadingScreen from "@/components/LoadingScreen";
import Navigation from "@/components/Navigation";
import "./globals.css";

const pixelifySans = Pixelify_Sans({
  subsets: ["latin"],
  variable: "--font-pixelify",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
});

export const metadata: Metadata = {
  title: "Adam Sawicki-Stanul",
  description: "My awesome website!",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${pixelifySans.variable} ${firaCode.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navigation />
        {children}
        <LoadingScreen />
      </body>
    </html>
  );
}
