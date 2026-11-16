import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Prasanth | AI Headquarters", description: "Evidence-driven wholesale growth headquarters" };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }
