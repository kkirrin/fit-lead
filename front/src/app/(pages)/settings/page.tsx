'use client';

import { useState, useEffect, FormEvent } from 'react';
import Image from 'next/image';
import api from '@/lib/api';

interface IUserProfile {
    name: string;
    email: string;
    avatar: string;
}

export default function SettingsPage() {
    const [profile, setProfile] = useState<IUserProfile>({ name: '', email: '', avatar: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await api.get('/users/profile');
                setProfile(data);
            } catch (error) {
                console.error('Failed to fetch profile', error);
                setMessage('Ошибка загрузки профиля');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');
        try {
            await api.put('/users/profile', profile);
            setMessage('Профиль успешно обновлен!');
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
                    <Image width={50} height={50} src={profile.avatar || 'https://i.pravatar.cc/100'} alt="Avatar" className="w-24 h-24 rounded-full object-cover" />
                    <div className="flex-1">
                        <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">URL аватара</label>
                        <input
                            type="url"
                            id="avatar"
                            name="avatar"
                            value={profile.avatar}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
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