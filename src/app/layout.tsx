import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Vazirmatn } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const vazir = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazir",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "استودیو نوا — آژانس خلاقیت دیجیتال",
    template: "%s | استودیو نوا",
  },
  description:
    "استودیو نوا یک آژانس دیجیتال چهارنفره است: طراحی رابط کاربری، توسعه وب، برندینگ و استراتژی محتوا — با عشق به جزئیات و وسواس روی نتیجه.",
  metadataBase: new URL("http://localhost:3000"),
};

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

export default function RootLayout({ children }: { children: ReactNode }) {
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
        <Navbar />
        <main className="min-h-dvh">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
