'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, BarChart3, Settings } from 'lucide-react';
import Image from 'next/image';
import { useProfileContext } from '@/app/context/ProfileContext';

const navLinks = [
    { name: 'Дашборд', href: '/', icon: LayoutDashboard },
    { name: 'Товары', href: '/products', icon: Package },
    { name: 'Статистика', href: '/stats', icon: BarChart3 },
    { name: 'Настройки', href: '/settings', icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { profile } = useProfileContext();

    return (
        <aside className="w-64 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col">
            {/* Логотип */}
            <div className="h-16 flex items-center justify-center border-b border-gray-200">
                <Link href="/" className="text-2xl font-bold text-blue-600">
                    FitLead
                </Link>
            </div>

            {/* Навигация */}
            <nav className="flex-grow px-4 py-6">
                <ul>
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <li key={link.name} className="mb-2">
                                <Link
                                    href={link.href}
                                    className={`flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200
                                    ${isActive ? 'bg-blue-100 text-blue-600 font-semibold' : ''}`}
                                >
                                    <link.icon className="w-5 h-5 mr-3" />
                                    <span>{link.name}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Футер сайдбара (например, инфо о пользователе) */}
            <div className="p-4 border-t border-gray-200">
                <div className="flex items-center">
                    <Image
                        src={(profile?.avatar && profile.avatar.length > 0) ? profile.avatar : 'https://i.pravatar.cc/40'}
                        alt="User avatar"
                        className="w-10 h-10 rounded-full object-cover"
                        width={50}
                        height={50}
                    />
                    <div className="ml-3">
                        <p className="font-semibold text-sm">{profile?.name ?? 'Гость'}</p>
                        <p className="text-xs text-gray-500">{profile?.email ?? ''}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}