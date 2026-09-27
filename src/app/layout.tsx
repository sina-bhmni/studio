import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Vazirmatn } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { getSiteSettings } from "@/lib/data";

const vazir = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazir",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: {
      default: `${settings.siteName} — آژانس خلاقیت دیجیتال`,
      template: `%s | ${settings.siteName}`,
    },
    description: settings.seoDescription,
    metadataBase: new URL("http://localhost:3000"),
  };
}

/** جلوگیری از فلش تم هنگام لود */
const themeScript = `
(function(){
  try {
    var t = localStorage.getItem("nova-theme");
    if (t !== "light" && t !== "dark") {
      t = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    }
    document.documentElement.setAttribute("data-theme", t);
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "dark");
  }
})();
`;

export default async function RootLayout({ children }: { children: ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
      </head>
      <body
        className={`${vazir.variable} font-sans noise bg-background text-foreground antialiased`}
      >
        <Navbar siteName={settings.siteName} />
        <main className="min-h-dvh">{children}</main>
        <Footer settings={settings} />
      </body>
    </html>
  );
}
