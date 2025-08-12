'use client'; 

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import ProductCard from '@/app/components/ProductCard';

export interface IProduct {
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

const CATEGORIES = ['спортпит', 'оборудование', 'одежда', 'гаджеты'];

export default function ProductsPage() {

    const [products, setProducts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('createdAt');
    const [order, setOrder] = useState('desc');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
    const [editFormData, setEditFormData] = useState({
        title: '',
        description: '',
        category: 'спортпит',
        price: '',
        commissionPercent: '',
        originalUrl: '' 
    });

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const params = new URLSearchParams({
                    search: searchTerm,
                    sortBy,
                    order,
                });
                if (selectedCategory && selectedCategory !== 'all') {
                    params.append('category', selectedCategory);
                }

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
    }, [searchTerm, sortBy, order, selectedCategory]);

    const startEditing = (product: IProduct) => {
        setEditingProduct(product);
        setEditFormData({
            title: product.title,
            description: product.description,
            category: product.category,
            price: String(product.price),
            commissionPercent: String(product.commissionPercent),
            originalUrl: product.originalUrl
        });
    };

    const cancelEditing = () => {
        setEditingProduct(null);
    };

    const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (productId: string) => {
        try {
            const updatedData = {
                ...editFormData,
                price: Number(editFormData.price),
                commissionPercent: Number(editFormData.commissionPercent),
            };
            const { data: updatedProduct } = await api.put(`/products/${productId}`, updatedData);
            
            setProducts(currentProducts => currentProducts.map(p => 
                p._id === productId ? updatedProduct : p
            ));
            
            cancelEditing();
        } catch (err) {
            console.error('Не удалось обновить товар', err);
        }
    };

    const handleDelete = async (productId: string) => {
        if (window.confirm('Вы уверены?')) {
            try {
                await api.delete(`/products/${productId}`);
                setProducts(currentProducts => currentProducts.filter(p => p._id !== productId));
            } catch (err) {
                console.error('Не удалось удалить товар', err);
            }
        }
    };
    
    return (
        <main className="container mx-auto p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Мои товары</h1>
                <Link href="/products/add">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center shadow-sm">
                        <span className="mr-2">+</span> Добавить товар
                    </button>
                </Link>
            </div>

            {/* Блок фильтров, поиска и сортировки */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-4 bg-white rounded-lg border shadow-sm">
                <div className="md:col-span-1">
                    <input
                        type="text"
                        placeholder="Поиск по названию..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                    />
                </div>
                <div className="md:col-span-2 flex items-center justify-end flex-wrap gap-4">
                    <div>
                        <label className="text-sm mr-2">Категория:</label>
                        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-3 py-2 border rounded-md bg-white">
                            <option value="all">Все категории</option>
                            {CATEGORIES.map(cat => (
                                <option key={cat} value={cat} className="capitalize">{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center space-x-2">
                         <label className="text-sm">Сортировать:</label>
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-2 border rounded-md bg-white">
                            <option value="createdAt">Дате</option>
                            <option value="price">Цене</option>
                            <option value="commissionPercent">Комиссии</option>
                            <option value="clicks">Кликам</option>
                        </select>
                        <select value={order} onChange={(e) => setOrder(e.target.value)} className="px-3 py-2 border rounded-md bg-white">
                            <option value="desc">↓ По убыв.</option>
                            <option value="asc">↑ По возр.</option>
                        </select>
                    </div>
                </div>
            </div>

            {loading && <p className="text-center mt-10">Загрузка товаров...</p>}
            {error && <p className="text-center mt-10 text-red-500">{error}</p>}

            {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.length > 0 ? products.map((product) => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            isEditing={editingProduct?._id === product._id}
                            editFormData={editFormData}
                            onStartEdit={startEditing}
                            onCancelEdit={cancelEditing}
                            onDelete={handleDelete}
                            onUpdate={handleUpdate}
                            onFormChange={handleEditFormChange}
                        />
                    )) : (
                        <div className="col-span-full text-center py-16 text-gray-500 bg-white rounded-lg shadow-sm border">
                            <p className="font-semibold text-lg">Товары не найдены</p>
                            <p className="mt-2">Попробуйте изменить фильтры или добавить новый товар.</p>
                        </div>
                    )}
                </div>
            )}
        </main>
    );
}