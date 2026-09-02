import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpirtunApp | Human-led applications",
  description: "A WebMCP-native workspace where people and agents prepare opportunity applications together.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
