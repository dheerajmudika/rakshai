import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "RakshAI — AI Digital Public Safety Intelligence Platform",
  description:
    "India's AI-powered digital public safety intelligence platform. Protecting citizens from phishing, fake websites, digital arrest scams, fake currency and cyber fraud using intelligent AI assistance.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} font-body antialiased bg-void text-white`}
      >
        {/* Star field and noise overlay for background effect */}
        <div className="star-field" aria-hidden="true" />
        <div className="noise-overlay pointer-events-none fixed inset-0 z-0 opacity-40" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
