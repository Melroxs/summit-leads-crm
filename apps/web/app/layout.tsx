import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "../components/sidebar";

export const metadata: Metadata = {
  title: "AI Sales CRM Platform",
  description: "Voice training, dialer operations, recordings, and QA dashboard"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="layout">
          <Sidebar />
          <main className="main">
            <div className="content">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
