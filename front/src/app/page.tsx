'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import ProductCard from '@/app/components/ProductCard';
// Интерфейс для данных статистики
interface IStats {
    totalProducts: number;
    totalClicks: number;
    potentialIncome: number;
}

interface IProduct {
    _id: string;
    title: string;
    description: string;
    category: string;
    price: number;
    commissionPercent: number;
    clicks: number;
    referralCode: string;
    originalUrl: string;
}

export default function DashboardPage() {
    // Состояния для данных
    const [stats, setStats] = useState<IStats | null>(null);
    const [recentProducts, setRecentProducts] = useState<IProduct[]>([]);
    
    // Состояния для UI
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Запрашиваем статистику и 3 последних товара одновременно
                const [statsResponse, productsResponse] = await Promise.all([
                    api.get('/stats'),
                    api.get('/products?sortBy=createdAt&order=desc&limit=3')
                ]);

                setStats(statsResponse.data);
                setRecentProducts(productsResponse.data);
                
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

    // Функции-заглушки для передачи в ProductCard, т.к. на дашборде нет редактирования
    const dummyHandler = () => {};

    if (loading) return (
        <div className="p-8">
            <p className="text-center mt-20 text-gray-500">Загрузка дашборда...</p>
        </div>
    );
    
    if (error) return (
        <div className="p-8">
            <p className="text-center mt-20 text-red-500">{error}</p>
        </div>
    );

    return (
        <main className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Дашборд</h1>

            {/* Секция с карточками статистики */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-md border transition-shadow hover:shadow-lg">
                    <h3 className="text-gray-500 text-sm font-medium">Всего товаров</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{stats?.totalProducts ?? 0}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border transition-shadow hover:shadow-lg">
                    <h3 className="text-gray-500 text-sm font-medium">Всего кликов</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{stats?.totalClicks ?? 0}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border transition-shadow hover:shadow-lg">
                    <h3 className="text-gray-500 text-sm font-medium">Потенциальный доход</h3>
                    <p className="text-3xl font-bold text-green-600 mt-2">{stats?.potentialIncome ?? 0} руб.</p>
                </div>
            </div>

            {/* Секция с последними добавленными товарами */}
            <div className="bg-white p-6 rounded-xl shadow-md border">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Последние товары</h2>
                    <Link href="/products" className="text-blue-600 hover:underline font-semibold text-sm">
                        Все товары →
                    </Link>
                </div>
                
                {/* Сетка для карточек товаров */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {recentProducts.length > 0 ? recentProducts.map((product) => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            isEditing={false}      // Редактирование здесь всегда выключено
                            showActions={false}   // Прячем кнопки "Редактировать" и "Удалить"
                            
                            // Передаем пустые функции и объекты, чтобы удовлетворить пропсы компонента
                            editFormData={{}}
                            onStartEdit={dummyHandler}
                            onCancelEdit={dummyHandler}
                            onDelete={dummyHandler}
                            onUpdate={dummyHandler}
                            onFormChange={dummyHandler}
                        />
                    )) : (
                        <div className="col-span-full text-center py-10 text-gray-500">
                            <p>Вы еще не добавили ни одного товара.</p>
                            <Link href="/products/add" className="text-blue-600 hover:underline mt-2 inline-block">
                                Добавить первый товар
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}