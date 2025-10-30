// app/layout.jsx
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "LogPack Dashboard",
  description: "Dashboard com sidebar fixa e recursos animados",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} flex min-h-screen bg-background`}>
        <main className="flex-1 p-6 overflow-x-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}