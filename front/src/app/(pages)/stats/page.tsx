'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import TopProductsChart from '@/app/components/TopProductsChart'; 

interface IStats {
    totalProducts: number;
    totalClicks: number;
    potentialIncome: number;
    categoryStats: { _id: string; count: number }[];
    topProductsByClicks: { _id: string; title: string; clicks: number }[];
}

export default function StatsPage() {
    const [stats, setStats] = useState<IStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const { data } = await api.get('/stats');
                setStats(data);
                setError(null);
            } catch (err) {
                setError('Не удалось загрузить статистику.');
                console.error("Failed to fetch stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <p className="text-center mt-20">Загрузка статистики...</p>;
    if (error) return <p className="text-center mt-20 text-red-500">{error}</p>;
    if (!stats) return <p className="text-center mt-20 text-gray-500">Нет данных для отображения.</p>;

    // Подготовка данных для графика топ-продуктов
    const topProductsChartData = {
        labels: stats.topProductsByClicks?.map(p => p.title) ?? [],
        data: stats.topProductsByClicks?.map(p => p.clicks) ?? [],
    };

    return (
        <main className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">Статистика</h1>

            {/* Карточки с основной статистикой */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-gray-500 text-sm font-medium">Всего товаров</h3>
                    <p className="text-3xl font-bold text-gray-800">{stats.totalProducts}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-gray-500 text-sm font-medium">Всего кликов</h3>
                    <p className="text-3xl font-bold text-gray-800">{stats.totalClicks}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-gray-500 text-sm font-medium">Потенциальный доход</h3>
                    <p className="text-3xl font-bold text-green-600">{stats.potentialIncome} руб.</p>
                </div>
            </div>

            {/* Блок с графиком и категориями */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* График топ продуктов */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    {stats.topProductsByClicks && stats.topProductsByClicks.length > 0 ? (
                        <TopProductsChart chartData={topProductsChartData} />
                    ) : (
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Топ-5 товаров</h3>
                            <p className="text-gray-500">Пока нет кликов ни по одному товару.</p>
                        </div>
                    )}
                </div>

                {/* Статистика по категориям */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">Товары по категориям</h2>
                    <ul>
                        {stats.categoryStats.length > 0 ? (
                            stats.categoryStats.map(cat => (
                                <li key={cat._id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                                    <span className="capitalize text-gray-700">{cat._id}</span>
                                    <span className="font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded-full text-sm">{cat.count} шт.</span>
                                </li>
                            ))
                        ) : (
                            <p className="text-gray-500">Нет данных по категориям.</p>
                        )}
                    </ul>
                </div>
            </div>
        </main>
    );
}