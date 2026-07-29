import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SID-Web | Sistem Informasi Dusun",
  description: "Portal Data dan Sistem Informasi Dusun",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          window.addEventListener('error', function(event) {
            const div = document.createElement('div');
            div.style = 'padding:20px;color:red;background:white;z-index:9999;position:fixed;top:0;left:0;width:100%;height:100%;overflow:auto;';
            div.innerHTML = '<h1>Global JavaScript Error</h1><pre>' + (event.error ? event.error.stack : event.message) + '</pre>';
            document.body.appendChild(div);
          });
          window.addEventListener('unhandledrejection', function(event) {
            const div = document.createElement('div');
            div.style = 'padding:20px;color:red;background:white;z-index:9999;position:fixed;top:0;left:0;width:100%;height:100%;overflow:auto;';
            div.innerHTML = '<h1>Unhandled Promise Rejection</h1><pre>' + (event.reason ? (event.reason.stack || event.reason) : 'Unknown reason') + '</pre>';
            document.body.appendChild(div);
          });
        `}} />
      </head>
      <body className={`${inter.className} antialiased bg-slate-50 text-slate-900 min-h-screen flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
