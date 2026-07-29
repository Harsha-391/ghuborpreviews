import type { Metadata } from "next";
import { Almarai, Instrument_Serif } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "../components/AuthContext";

import { ThemeProvider } from "../components/ThemeContext";
import { ImageConfigProvider } from "../components/ImageConfigContext";

const almarai = Almarai({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "700", "800"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ghubor | Armor for the Modern Gibbor",
  description: "Armor for the modern Gibbor. Wearable scripture. Fighting battles nobody sees. Forged in the dark, speaking in fragments, bound to become skin.",
  icons: {
    icon: "/logo-white.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${instrumentSerif.variable}`}>
      <head>
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '4240082786209356');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=4240082786209356&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </head>
      <body className={almarai.className}>
        <ThemeProvider>
          <ImageConfigProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </ImageConfigProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

