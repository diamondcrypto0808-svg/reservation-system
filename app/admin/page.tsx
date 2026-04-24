'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface Reservation {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  totalAmount: number;
  user: {
    name: string;
    email: string;
  };
  service: {
    name: string;
  };
  payment: {
    status: string;
  } | null;
}

interface Stats {
  totalReservations: number;
  totalRevenue: number;
  pendingReservations: number;
  completedReservations: number;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalReservations: 0,
    totalRevenue: 0,
    pendingReservations: 0,
    completedReservations: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      if (session.user.role !== 'ADMIN') {
        router.push('/dashboard');
      } else {
        fetchReservations();
      }
    }
  }, [status, session, router]);

  const fetchReservations = async () => {
    try {
      const response = await fetch('/api/reservations');
      const data = await response.json();
      setReservations(data);

      // 統計を計算
      const totalRevenue = data
        .filter((r: Reservation) => r.payment?.status === 'COMPLETED')
        .reduce((sum: number, r: Reservation) => sum + r.totalAmount, 0);

      setStats({
        totalReservations: data.length,
        totalRevenue,
        pendingReservations: data.filter((r: Reservation) => r.status === 'PENDING').length,
        completedReservations: data.filter((r: Reservation) => r.status === 'COMPLETED').length,
      });
    } catch (error) {
      console.error('Failed to fetch reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateReservationStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/reservations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchReservations();
      }
    } catch (error) {
      console.error('Failed to update reservation:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
      COMPLETED: 'bg-blue-100 text-blue-800',
    };

    const labels = {
      PENDING: '保留中',
      CONFIRMED: '確定',
      CANCELLED: 'キャンセル',
      COMPLETED: '完了',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  if (status === 'loading' || loading) {
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
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              予約システム - 管理画面
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/admin/services" className="text-gray-700 hover:text-pink-500 transition-colors">
                サービス管理
              </Link>
              <Link href="/admin/users" className="text-gray-700 hover:text-pink-500 transition-colors">
                ユーザー管理
              </Link>
              <span className="text-gray-700">{session?.user?.name}さん</span>
            </div>
          </div>
        </nav>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ダッシュボード
          </h1>
          <p className="text-gray-600">
            予約状況と売上を管理できます
          </p>
        </div>

        {/* 統計カード */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">総予約数</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalReservations}</p>
              </div>
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">総売上</p>
                <p className="text-3xl font-bold text-gray-900">
                  ¥{stats.totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">保留中</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pendingReservations}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">完了</p>
                <p className="text-3xl font-bold text-gray-900">{stats.completedReservations}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* 予約一覧 */}
        <div className="card">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">予約一覧</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    予約ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    顧客名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    サービス
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    日時
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    金額
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ステータス
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reservations.map((reservation) => (
                  <tr key={reservation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {reservation.id.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{reservation.user.name}</div>
                      <div className="text-sm text-gray-500">{reservation.user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reservation.service.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {format(new Date(reservation.date), 'yyyy/MM/dd', { locale: ja })}
                      </div>
                      <div className="text-sm text-gray-500">
                        {reservation.startTime} - {reservation.endTime}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ¥{reservation.totalAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(reservation.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {reservation.status === 'CONFIRMED' && (
                        <button
                          onClick={() => updateReservationStatus(reservation.id, 'COMPLETED')}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          完了
                        </button>
                      )}
                      {(reservation.status === 'PENDING' || reservation.status === 'CONFIRMED') && (
                        <button
                          onClick={() => updateReservationStatus(reservation.id, 'CANCELLED')}
                          className="text-red-600 hover:text-red-900"
                        >
                          キャンセル
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
