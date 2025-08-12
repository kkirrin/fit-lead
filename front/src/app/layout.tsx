// frontend/src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/app/components/Sidebar"; // Импортируем наш новый сайдбар

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FitLead - Affiliate Dashboard",
  description: "Управление партнерскими товарами для фитнес-блогеров",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <div className="flex h-screen bg-gray-50">
          {/* Боковая панель */}
          <Sidebar />
          
          {/* Основной контент */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
                {/* children - это то место, куда Next.js будет рендерить наши страницы */}
                {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}