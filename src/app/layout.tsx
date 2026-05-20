import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cockroach Janta Party — Voice of the Lazy & Unemployed",
  description: "A political party for the people the system forgot to count.",
};

export const viewport: Viewport = {
  themeColor: "#F4EBD7",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bowlby+One&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Oswald:wght@400;500;600;700&display=swap" />
      </head>
      <body>{children}</body>
    </html>
  );
}
