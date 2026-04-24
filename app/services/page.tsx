'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  image: string | null;
}

export default function ServicesPage() {
  const { data: session } = useSession();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              予約システム
            </Link>
            <div className="flex gap-4">
              {session ? (
                <Link href="/dashboard" className="btn-primary">
                  マイページ
                </Link>
              ) : (
                <>
                  <Link href="/auth/signin" className="px-4 py-2 text-gray-700 hover:text-pink-500 transition-colors">
                    ログイン
                  </Link>
                  <Link href="/auth/signup" className="btn-primary">
                    新規登録
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            サービス一覧
          </h1>
          <p className="text-xl text-gray-600">
            お好きなサービスをお選びください
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">現在、利用可能なサービスはありません</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.id} className="card overflow-hidden">
                <div className="relative h-48 bg-gradient-to-br from-pink-100 to-rose-100">
                  {service.image ? (
                    <Image
                      src={service.image}
                      alt={service.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <svg className="w-16 h-16 text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-pink-500">
                        ¥{service.price.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {service.duration}分
                    </div>
                  </div>
                  {session ? (
                    <Link
                      href={`/booking/${service.id}`}
                      className="block w-full text-center btn-primary"
                    >
                      予約する
                    </Link>
                  ) : (
                    <Link
                      href="/auth/signin"
                      className="block w-full text-center btn-secondary"
                    >
                      ログインして予約
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
