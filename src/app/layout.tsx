import type { Metadata } from "next";

import "@/app/globals.css";

export const metadata: Metadata = {
  title: "H&C OtoServis",
  description: "Tek kullanicili oto servis yonetim sistemi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" data-theme="dark">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
