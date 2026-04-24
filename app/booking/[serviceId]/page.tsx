'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { format, addDays, startOfDay } from 'date-fns';
import { ja } from 'date-fns/locale';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
}

export default function BookingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const serviceId = params.serviceId as string;

  const [service, setService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 利用可能な日付（今日から30日間）
  const availableDates = Array.from({ length: 30 }, (_, i) => {
    const date = addDays(startOfDay(new Date()), i);
    return format(date, 'yyyy-MM-dd');
  });

  // 利用可能な時間帯
  const availableTimes = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00'
  ];

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      fetchService();
    }
  }, [status, router, serviceId]);

  const fetchService = async () => {
    try {
      const response = await fetch('/api/services');
      const data = await response.json();
      const foundService = data.find((s: Service) => s.id === serviceId);
      setService(foundService);
    } catch (error) {
      console.error('Failed to fetch service:', error);
    }
  };

  const calculateEndTime = (startTime: string, duration: number) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + duration;
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!selectedDate || !selectedTime) {
      setError('日時を選択してください');
      setLoading(false);
      return;
    }

    try {
      const endTime = calculateEndTime(selectedTime, service!.duration);

      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId,
          date: selectedDate,
          startTime: selectedTime,
          endTime,
          notes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || '予約に失敗しました');
        setLoading(false);
        return;
      }

      router.push(`/payment/${data.id}`);
    } catch (error) {
      setError('予約に失敗しました');
      setLoading(false);
    }
  };

  if (status === 'loading' || !service) {
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
              予約システム
            </Link>
            <Link href="/dashboard" className="text-gray-700 hover:text-pink-500 transition-colors">
              マイページに戻る
            </Link>
          </div>
        </nav>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            予約フォーム
          </h1>
          <p className="text-gray-600">
            ご希望の日時を選択してください
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* サービス情報 */}
          <div className="md:col-span-1">
            <div className="card p-6 sticky top-4">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                サービス情報
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">サービス名</p>
                  <p className="font-medium text-gray-900">{service.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">説明</p>
                  <p className="text-sm text-gray-900">{service.description}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">所要時間</p>
                  <p className="font-medium text-gray-900">{service.duration}分</p>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-600">料金</p>
                  <p className="text-2xl font-bold text-pink-500">
                    ¥{service.price.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 予約フォーム */}
          <div className="md:col-span-2">
            <div className="card p-8">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="label">
                    予約日
                  </label>
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="input-field"
                    required
                  >
                    <option value="">日付を選択してください</option>
                    {availableDates.map((date) => (
                      <option key={date} value={date}>
                        {format(new Date(date), 'yyyy年MM月dd日(E)', { locale: ja })}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">
                    開始時刻
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="input-field"
                    required
                  >
                    <option value="">時刻を選択してください</option>
                    {availableTimes.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  {selectedTime && (
                    <p className="mt-2 text-sm text-gray-600">
                      終了予定時刻: {calculateEndTime(selectedTime, service.duration)}
                    </p>
                  )}
                </div>

                <div>
                  <label className="label">
                    備考（任意）
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="input-field"
                    rows={4}
                    placeholder="ご要望やご質問などがあればご記入ください"
                  />
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-3">予約内容の確認</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">サービス:</span>
                      <span className="font-medium">{service.name}</span>
                    </div>
                    {selectedDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">日付:</span>
                        <span className="font-medium">
                          {format(new Date(selectedDate), 'yyyy年MM月dd日(E)', { locale: ja })}
                        </span>
                      </div>
                    )}
                    {selectedTime && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">時間:</span>
                        <span className="font-medium">
                          {selectedTime} - {calculateEndTime(selectedTime, service.duration)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between pt-3 border-t border-gray-200">
                      <span className="text-gray-900 font-bold">合計金額:</span>
                      <span className="text-xl font-bold text-pink-500">
                        ¥{service.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '予約中...' : '予約を確定する'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
