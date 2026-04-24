'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  image: string | null;
  active: boolean;
}

export default function AdminServicesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    image: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      if (session.user.role !== 'ADMIN') {
        router.push('/dashboard');
      } else {
        fetchServices();
      }
    }
  }, [status, session, router]);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowModal(false);
        setFormData({ name: '', description: '', price: '', duration: '', image: '' });
        fetchServices();
      }
    } catch (error) {
      console.error('Failed to create service:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/admin" className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              予約システム - 管理画面
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-gray-700 hover:text-pink-500 transition-colors">
                ダッシュボード
              </Link>
              <Link href="/admin/users" className="text-gray-700 hover:text-pink-500 transition-colors">
                ユーザー管理
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              サービス管理
            </h1>
            <p className="text-gray-600">
              提供するサービスを管理できます
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary"
          >
            新規サービス追加
          </button>
        </div>

        {/* サービス一覧 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service.id} className="card p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {service.name}
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-2">
                {service.description}
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">料金:</span>
                  <span className="font-medium">¥{service.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">所要時間:</span>
                  <span className="font-medium">{service.duration}分</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ステータス:</span>
                  <span className={`font-medium ${service.active ? 'text-green-600' : 'text-red-600'}`}>
                    {service.active ? '有効' : '無効'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* モーダル */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              新規サービス追加
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">サービス名</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  placeholder="例: ヘアカット"
                />
              </div>
              <div>
                <label className="label">説明</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
                  rows={3}
                  placeholder="サービスの詳細を入力"
                />
              </div>
              <div>
                <label className="label">料金（円）</label>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="input-field"
                  placeholder="5000"
                />
              </div>
              <div>
                <label className="label">所要時間（分）</label>
                <input
                  type="number"
                  required
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="input-field"
                  placeholder="60"
                />
              </div>
              <div>
                <label className="label">画像URL（任意）</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="input-field"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 btn-secondary"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 btn-primary disabled:opacity-50"
                >
                  {loading ? '作成中...' : '作成'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
