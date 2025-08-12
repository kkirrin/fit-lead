'use client'; 

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

interface IProduct {
    _id: string;
    title: string;
    category: string;
    price: number;
    commissionPercent: number;
    clicks: number;
    referralCode: string;
    originalUrl: string;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
    const [editFormData, setEditFormData] = useState({
    title: '',
        category: 'спортпит',
        price: '',
        commissionPercent: '',
        originalUrl: '' 
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('createdAt');
    const [order, setOrder] = useState('desc');

    const startEditing = (product: IProduct) => {
        setEditingProduct(product);
        setEditFormData({
            title: product.title,
            category: product.category,
            price: String(product.price),
            commissionPercent: String(product.commissionPercent),
            originalUrl: product.originalUrl // <--- ДОБАВИТЬ
        });
    };

    const cancelEditing = () => {
        setEditingProduct(null);
    }

    const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setEditFormData({
            ...editFormData,
            [e.target.name]: e.target.value
        })
    }

    const handleUpdate = async (productId: string) => {
        try {
            const updatedData = {
                ...editFormData,
                price: Number(editFormData.price),
                commissionPercent: Number(editFormData.commissionPercent)
            };
            await api.put(`/products/${productId}`, updatedData);
            
            // Обновляем состояние на клиенте без повторного запроса к API
            setProducts(products.map(p => 
                p._id === productId ? { ...p, ...updatedData } : p
            ));
            
            cancelEditing();
        } catch (err) {
            setError('Не удалось обновить товар');
            console.error(err);
        }
    };

    const handleDelete = async (productId: string) => {
        if (window.confirm('Вы уверены, что хотите удалить этот товар?')) {
            try {
                await api.delete(`/products/${productId}`);
                // Удаляем товар из состояния на клиенте
                setProducts(products.filter(p => p._id !== productId));
            } catch (err) {
                setError('Не удалось удалить товар');
                console.error(err);
            }
        }
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                // Создаем параметры запроса
                const params = new URLSearchParams({
                    search: searchTerm,
                    sortBy,
                    order,
                });
                const response = await api.get(`/products?${params.toString()}`);
                setProducts(response.data);
                setError(null);
            } catch (err) {
                setError('Не удалось загрузить товары');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        const debounceFetch = setTimeout(() => {
            fetchProducts();
        }, 300);

        return () => clearTimeout(debounceFetch);

    }, [searchTerm, sortBy, order]); // Перезапускаем эффект при изменении этих состояний
    
    if (loading) return <p className="text-center mt-10">Загрузка...</p>;
    if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

    return (
        <main className="container mx-auto p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Мои товары</h1>
                <Link href="/products/add">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                        + Добавить товар
                    </button>
                </Link>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                {/* Блок фильтров, поиска и сортировки */}
                <div className="flex justify-between items-center mb-4 p-4 bg-gray-50 rounded-lg">
                    {/* Поиск */}
                    <div className="w-1/3">
                        <input
                            type="text"
                            placeholder="Поиск по названию..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                        />
                    </div>
                    
                    {/* Сортировка */}
                    <div className="flex items-center space-x-2">
                        <label className="text-sm">Сортировать по:</label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-3 py-2 border rounded-md bg-white"
                        >
                            <option value="createdAt">Дате</option>
                            <option value="price">Цене</option>
                            <option value="commissionPercent">Комиссии</option>
                            <option value="clicks">Кликам</option>
                        </select>
                        <select
                            value={order}
                            onChange={(e) => setOrder(e.target.value)}
                            className="px-3 py-2 border rounded-md bg-white"
                        >
                            <option value="desc">Убыванию</option>
                            <option value="asc">Возрастанию</option>
                        </select>
                    </div>
                </div>
                

                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Название
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Категория
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Цена / Комиссия
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Ссылка
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Действия
                            </th>
                        </tr>
                    </thead>
                          
                    <tbody>
                        {products.map((product) => (
                            <tr key={product._id}>
                                {/* --- Ячейка Название --- */}
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    {editingProduct?._id === product._id ? (
                                        <input type="text" name="title" value={editFormData.title} onChange={handleEditFormChange} className="w-full p-1 border rounded" />
                                    ) : (
                                        <p className="text-gray-900 whitespace-no-wrap">{product.title}</p>
                                    )}
                                </td>
                                {/* --- Ячейка Категория --- */}
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    {editingProduct?._id === product._id ? (
                                        <>  
                                            <select name="category" value={editFormData.category} onChange={handleEditFormChange} className="w-full p-1 border rounded mb-1">
                                                <option value="спортпит">Спортпит</option>
                                                <option value="оборудование">Оборудование</option>
                                                <option value="одежда">Одежда</option>
                                                <option value="гаджеты">Гаджеты</option>
                                            </select>

    
                                            <input type="url" name="originalUrl" value={editFormData.originalUrl} onChange={handleEditFormChange} className="w-full p-1 border rounded" placeholder="URL товара"/>
                                        </>
                                    ) : (
                                        <p className="text-gray-900 whitespace-no-wrap">{product.category}</p>
                                    )}
                                </td>
                                {/* --- Ячейка Цена / Комиссия --- */}
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    {editingProduct?._id === product._id ? (
                                        <>
                                            <input type="number" name="price" value={editFormData.price} onChange={handleEditFormChange} className="w-full p-1 border rounded mb-1" placeholder="Цена" />
                                            <input type="number" name="commissionPercent" value={editFormData.commissionPercent} onChange={handleEditFormChange} className="w-full p-1 border rounded" placeholder="%"/>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-gray-900 whitespace-no-wrap">{product.price} руб.</p>
                                            <p className="text-gray-600 whitespace-no-wrap">{product.commissionPercent}%</p>
                                        </>
                                    )}
                                </td>
                                {/* --- Ячейка Ссылка --- */}
                               <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <div className="flex flex-col">
                                        {/* Наша реферальная ссылка */}
                                        <a 
                                            href={`http://localhost:5000/ref/${product.referralCode}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="text-blue-600 hover:text-blue-800 font-semibold"
                                            title={`Реферальная ссылка. Ведет на: ${product.originalUrl}`}
                                        >
                                            /ref/{product.referralCode}
                                        </a>
                                        {/* Оригинальная ссылка, куда ведет редирект */}
                                        <a 
                                            href={product.originalUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-gray-500 hover:underline truncate"
                                            title={product.originalUrl}
                                        >
                                            {/* Обрезаем длинную ссылку для красоты */}
                                            {product.originalUrl.length > 30 ? `${product.originalUrl.substring(0, 30)}...` : product.originalUrl}
                                        </a>
                                    </div>
                                </td>
                                {/* --- Ячейка Действия --- */}
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    {editingProduct?._id === product._id ? (
                                        <>
                                            <button onClick={() => handleUpdate(product._id)} className="text-green-500 hover:text-green-700 mr-2">Сохранить</button>
                                            <button onClick={cancelEditing} className="text-gray-500 hover:text-gray-700">Отмена</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => startEditing(product)} className="text-yellow-500 hover:text-yellow-700 mr-2">Редакт.</button>
                                            <button onClick={() => handleDelete(product._id)} className="text-red-500 hover:text-red-700">Удалить</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>

    
                </table>
            </div>
        </main>
    );
}