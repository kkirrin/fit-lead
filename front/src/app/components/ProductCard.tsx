'use client';

import { BarChart, Link as LinkIcon, Edit, Trash2, Save, XCircle } from 'lucide-react';


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


interface EditFormData {
    title: string;
    description: string;
    category: string;
    originalUrl: string;
    price: string;
    commissionPercent: string;
}

interface ProductCardProps {
    product: IProduct;
    isEditing: boolean;
    editFormData?: EditFormData; 
    onStartEdit: (product: IProduct) => void;
    onCancelEdit: () => void;
    onDelete: (id: string) => void;
    onUpdate: (id: string) => void;
    onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    showActions?: boolean
}

const CATEGORIES = ['спортпит', 'оборудование', 'одежда', 'гаджеты'];

export default function ProductCard({
    product,
    isEditing,
    editFormData,
    onStartEdit,
    onCancelEdit,
    onDelete,
    onUpdate,
    onFormChange,
    showActions = true
}: ProductCardProps) {
    
    if (isEditing) {
        const form: EditFormData = editFormData ?? {
            title: product.title,
            description: product.description,
            category: product.category,
            originalUrl: product.originalUrl,
            price: String(product.price),
            commissionPercent: String(product.commissionPercent),
        };
        return (
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4 shadow-lg flex flex-col space-y-3 transition-all duration-300 ring-4 ring-yellow-200 ring-opacity-50">
                <input type="text" name="title" value={form.title} onChange={onFormChange} className="w-full p-2 border rounded font-bold text-lg" placeholder="Название товара"/>
                <textarea name="description" value={form.description} onChange={onFormChange} className="w-full p-2 border rounded text-sm h-24" placeholder="Описание"/>
                <select name="category" value={form.category} onChange={onFormChange} className="w-full p-2 border rounded text-sm bg-white">
                    {CATEGORIES.map(cat => (<option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>))}
                </select>
                <input type="url" name="originalUrl" value={form.originalUrl} onChange={onFormChange} className="w-full p-2 border rounded text-sm" placeholder="URL товара"/>
                <div className="flex space-x-2">
                    <input type="number" name="price" value={form.price} onChange={onFormChange} className="w-1/2 p-2 border rounded" placeholder="Цена"/>
                    <input type="number" name="commissionPercent" value={form.commissionPercent} onChange={onFormChange} className="w-1/2 p-2 border rounded" placeholder="% комиссии"/>
                </div>
                <div className="flex justify-end space-x-2 pt-2">
                    <button onClick={() => onUpdate(product._id)} className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 shadow-sm" title="Сохранить"><Save size={18} /></button>
                    <button onClick={onCancelEdit} className="p-2 bg-gray-400 text-white rounded-full hover:bg-gray-500 shadow-sm" title="Отменить"><XCircle size={18} /></button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl p-4 shadow-md flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border">
            {/* Заголовок и категория */}
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-gray-800 pr-2">{product.title}</h3>
                <span className="flex-shrink-0 text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded-full capitalize">{product.category}</span>
            </div>

            {/* Цена и комиссия */}
            <div className="flex items-baseline space-x-4">
                <p className="text-2xl font-bold text-gray-900">{product.price} <span className="text-base font-normal text-gray-500">руб.</span></p>
                <p className="text-green-600 font-semibold">{product.commissionPercent}%</p>
            </div>

            {/* Разделитель и описание */}
            <div className="flex-grow my-3 text-sm text-gray-600">
                <p>{product.description}</p>
            </div>

            {/* Статистика и ссылка */}
            <div className="border-t border-gray-100 pt-3 mt-3 space-y-2 text-sm">
                <div className="flex items-center text-gray-600">
                    <BarChart size={16} className="mr-2 text-gray-400"/>
                    <span>Клики: <span className="font-semibold text-gray-800">{product.clicks}</span></span>
                </div>
                <div className="flex items-center text-gray-600">
                    <LinkIcon size={16} className="mr-2 text-gray-400"/>
                    <a href={`http://localhost:5000/ref/${product.referralCode}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline truncate" title={product.originalUrl}>
                        Скопировать ссылку
                    </a>
                </div>
            </div>

            {/* Кнопки действий */}
            {showActions && (
                <div className="flex justify-end space-x-1 pt-2">
                    <button onClick={() => onStartEdit(product)} className="p-2 text-gray-500 rounded-full hover:bg-gray-100" title="Редактировать"><Edit size={18} /></button>
                    <button onClick={() => onDelete(product._id)} className="p-2 text-red-500 rounded-full hover:bg-red-50" title="Удалить"><Trash2 size={18} /></button>
                </div>
            )}
        </div>
    );
}