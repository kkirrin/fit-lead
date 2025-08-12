// frontend/src/app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

// Определяем интерфейсы для наших данных
interface IStats {
    totalProducts: number;
    totalClicks: number;
    potentialIncome: number;
}

interface IProduct {
    _id: string;
    title: string;
    category: string;
    price: number;
}

export default function DashboardPage() {
    const [stats, setStats] = useState<IStats | null>(null);
    const [recentProducts, setRecentProducts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Запрашиваем статистику и товары одновременно
                const [statsResponse, productsResponse] = await Promise.all([
                    api.get('/stats'),
                    api.get('/products')
                ]);

                setStats(statsResponse.data);
                // Берем 5 последних товаров для отображения на дашборде
                setRecentProducts(productsResponse.data.slice(0, 5));
                
                setError(null);
            } catch (err) {
                setError('Не удалось загрузить данные для дашборда.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <p className="text-center mt-20">Загрузка дашборда...</p>;
    if (error) return <p className="text-center mt-20 text-red-500">{error}</p>;

    return (
        <main className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">Дашборд</h1>

            {/* Секция со статистикой */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-gray-500 text-sm font-medium">Всего товаров</h3>
                    <p className="text-3xl font-bold text-gray-800">{stats?.totalProducts ?? 0}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-gray-500 text-sm font-medium">Всего кликов</h3>
                    <p className="text-3xl font-bold text-gray-800">{stats?.totalClicks ?? 0}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-gray-500 text-sm font-medium">Потенциальный доход</h3>
                    <p className="text-3xl font-bold text-green-600">{stats?.potentialIncome ?? 0} руб.</p>
                </div>
            </div>

            {/* Секция с последними товарами */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Последние товары</h2>
                    <Link href="/products">
                        <button className="text-blue-500 hover:underline">
                            Смотреть все →
                        </button>
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="text-left text-sm text-gray-500">
                                <th className="py-2">Название</th>
                                <th className="py-2">Категория</th>
                                <th className="py-2">Цена</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentProducts.map((product) => (
                                <tr key={product._id} className="border-t">
                                    <td className="py-3 font-medium">{product.title}</td>
                                    <td className="py-3">{product.category}</td>
                                    <td className="py-3">{product.price} руб.</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}