'use client';

import { useState, FormEvent } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function AddProductPage() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('спортпит');
    const [price, setPrice] = useState('');
    const [commissionPercent, setCommissionPercent] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [originalUrl, setOriginalUrl] = useState('');

    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            await api.post('/products', {
                title,
                description,
                category,
                price: Number(price),
                commissionPercent: Number(commissionPercent),
                originalUrl
            });
            router.push('/products'); // Перенаправляем на список после успеха
        } catch (err) {
            setError('Не удалось создать товар. Проверьте данные.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="container mx-auto p-8 max-w-2xl">
            <h1 className="text-3xl font-bold mb-6">Добавить новый товар</h1>
            
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Название</label>
                    <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Описание</label>
                    <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
                </div>
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Категория</label>
                    <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        <option value="спортпит">Спортпит</option>
                        <option value="оборудование">Оборудование</option>
                        <option value="одежда">Одежда</option>
                        <option value="гаджеты">Гаджеты</option>
                    </select>
                </div>
                <div className="flex space-x-4">
                    <div className="flex-1">
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Цена</label>
                        <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} required min="0" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <div className="flex-1">
                        <label htmlFor="commission" className="block text-sm font-medium text-gray-700">% Комиссии</label>
                        <input type="number" id="commission" value={commissionPercent} onChange={(e) => setCommissionPercent(e.target.value)} required min="0" max="100" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                </div>

                <div>
                    <label htmlFor="originalUrl" className="block text-sm font-medium text-gray-700">Оригинальная ссылка на товар</label>
                    <input type="url" id="originalUrl" value={originalUrl} onChange={(e) => setOriginalUrl(e.target.value)} required placeholder="https://www.ozon.ru/..." className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button type="submit" disabled={loading} className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400">
                    {loading ? 'Создание...' : 'Создать товар'}
                </button>
            </form>
        </main>
    );
}