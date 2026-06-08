import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "SRM Portal — Microsoft Dynamics 365 Business Central",
  description: "Enterprise Supplier Relationship Management Platform integrated with Microsoft Dynamics 365 Business Central",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
