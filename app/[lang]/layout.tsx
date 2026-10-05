import type { Metadata } from "next";
import { Pixelify_Sans, Fira_Code, Shadows_Into_Light } from "next/font/google";
import { lang } from "next/root-params";
import LoadingScreen from "@/components/LoadingScreen";
import Navigation from "@/components/Navigation";
import { getDictionary } from "@/lib/i18n";
import "./globals.css"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

const pixelifySans = Pixelify_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-pixelify",
});

const firaCode = Fira_Code({
  subsets: ["latin", "latin-ext"],
  variable: "--font-fira-code",
});

const shadowsIntoLight = Shadows_Into_Light({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  variable: "--font-shadows",
});

export const metadata: Metadata = {
  title: "Adam Sawicki-Stanul",
  description: "My awesome website!",
};

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "pl" }];
}

export default async function RootLayout({
  children,
}: LayoutProps<'/[lang]'>) {
  const locale = await lang();
  const dict = await getDictionary();

  return (
    <html
      lang={locale}
      className={`${pixelifySans.variable} ${firaCode.variable} ${shadowsIntoLight.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navigation navigation={dict.navigation} />
        {children}
        <LoadingScreen loading={dict.loading} />
        <Analytics/>
        <SpeedInsights/>
      </body>
    </html>
  );
}
