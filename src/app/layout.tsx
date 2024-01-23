import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";

import "./globals.css";
import { merge } from "@/lib/utils";

const sora = Sora({
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "tinytodo",
    description: "A tiny, local todo list app.",
    manifest: "/manifest.json",
    icons: "/favicon.ico?v=1",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={merge("screen flex p-4", sora.className)}>
                {children}
            </body>
        </html>
    );
}
