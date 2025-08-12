'use client';

import { useState, useEffect, FormEvent } from 'react';
import Image from 'next/image';
import api from '@/lib/api';
import { useProfileContext } from '@/app/context/ProfileContext';

interface IUserProfile {
    name: string;
    email: string;
    avatar: string;
}

export default function SettingsPage() {
    const { profile: ctxProfile, setProfile: setCtxProfile } = useProfileContext();
    const [profile, setProfile] = useState<IUserProfile>({ name: '', email: '', avatar: '' });
    const [avatarSize, setAvatarSize] = useState<string>('100');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Инициализируем локальное состояние из контекста, когда он загрузится
        if (ctxProfile) {
            setProfile(ctxProfile);
            // Пытаемся извлечь размер из текущего avatar URL
            const match = (ctxProfile.avatar || '').match(/i\.pravatar\.cc\/(\d+)/);
            setAvatarSize(match?.[1] ?? '100');
            setLoading(false);
        } else {
            // если контекст пуст, пробуем загрузить напрямую (fallback)
            const fetchProfile = async () => {
                try {
                    const { data } = await api.get('/users/profile');
                    setProfile(data);
                    const match = (data.avatar || '').match(/i\.pravatar\.cc\/(\d+)/);
                    setAvatarSize(match?.[1] ?? '100');
                } catch (error) {
                    console.error('Failed to fetch profile', error);
                    setMessage('Ошибка загрузки профиля');
                } finally {
                    setLoading(false);
                }
            };
            fetchProfile();
        }
    }, [ctxProfile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleAvatarSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        // Оставляем только цифры
        const digitsOnly = raw.replace(/\D+/g, '');
        // Ограничим разумный диапазон 40..512
        let normalized = digitsOnly;
        if (digitsOnly.length > 0) {
            const num = Math.max(40, Math.min(512, parseInt(digitsOnly, 10)));
            normalized = String(num);
        }
        setAvatarSize(normalized);
        const size = normalized || '100';
        setProfile(prev => ({ ...prev, avatar: `https://i.pravatar.cc/${size}` }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');
        try {
            // Гарантируем корректный avatar перед отправкой
            const size = avatarSize || '100';
            const payload = { ...profile, avatar: `https://i.pravatar.cc/${size}` };
            await api.put('/users/profile', payload);
            setMessage('Профиль успешно обновлен!');
            // Обновляем контекст, чтобы Sidebar сразу отобразил изменения
            setCtxProfile(payload);
            // Скрываем сообщение через 3 секунды
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Failed to update profile', error);
            setMessage('Ошибка обновления профиля');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p className="text-center mt-10">Загрузка настроек...</p>;

    return (
        <main className="container mx-auto p-8 max-w-2xl">
            <h1 className="text-3xl font-bold mb-6">Настройки профиля</h1>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
                <div className="flex items-center space-x-4">
                    <Image width={96} height={96} src={profile.avatar || `https://i.pravatar.cc/${avatarSize || '100'}`} alt="Avatar" className="w-24 h-24 rounded-full object-cover" />
                    <div className="flex-1">
                        <label htmlFor="avatarSize" className="block text-sm font-medium text-gray-700">Размер аватара (только цифры, 40–512)</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            id="avatarSize"
                            name="avatarSize"
                            value={avatarSize}
                            onChange={handleAvatarSizeChange}
                            placeholder="100"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <p className="text-xs text-gray-500 mt-1">Итоговая ссылка: https://i.pravatar.cc/{avatarSize || '100'}</p>
                    </div>
                </div>

                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Имя</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={profile.name}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={profile.email}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <button type="submit" disabled={saving} className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 disabled:bg-gray-400">
                        {saving ? 'Сохранение...' : 'Сохранить изменения'}
                    </button>
                    {message && <p className="text-sm text-green-600">{message}</p>}
                </div>
            </form>
        </main>
    );
}