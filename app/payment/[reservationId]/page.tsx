'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Link from 'next/link';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface Reservation {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  totalAmount: number;
  service: {
    name: string;
    description: string;
  };
}

// モック決済フォーム
function MockPaymentForm({ reservation, onSuccess }: { reservation: Reservation; onSuccess: () => void }) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setError('');

    // カード番号の検証
    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    if (cleanCardNumber !== '4242424242424242') {
      setError('テストカード番号 4242 4242 4242 4242 を使用してください');
      setProcessing(false);
      return;
    }

    // 2秒待機（決済処理をシミュレート）
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 決済成功として処理
    try {
      const response = await fetch(`/api/payments/mock-success`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservationId: reservation.id }),
      });

      if (response.ok) {
        onSuccess();
      } else {
        setError('決済処理に失敗しました');
        setProcessing(false);
      }
    } catch (err) {
      setError('決済処理に失敗しました');
      setProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-yellow-800">
            <p className="font-medium mb-1">🧪 テストモード</p>
            <p>Stripeキーが未設定のため、テストモードで動作しています。</p>
            <p className="mt-2 font-medium">テストカード番号: 4242 4242 4242 4242</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h3 className="font-bold text-gray-900 mb-4">予約内容</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">サービス:</span>
            <span className="font-medium">{reservation.service.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">日付:</span>
            <span className="font-medium">
              {format(new Date(reservation.date), 'yyyy年MM月dd日(E)', { locale: ja })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">時間:</span>
            <span className="font-medium">
              {reservation.startTime} - {reservation.endTime}
            </span>
          </div>
          <div className="flex justify-between pt-3 border-t border-gray-200">
            <span className="text-gray-900 font-bold">お支払い金額:</span>
            <span className="text-2xl font-bold text-pink-500">
              ¥{reservation.totalAmount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div>
        <label className="label mb-4">お支払い情報（テスト）</label>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              カード番号
            </label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              placeholder="4242 4242 4242 4242"
              maxLength={19}
              className="input-field"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                有効期限
              </label>
              <input
                type="text"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                placeholder="MM/YY"
                maxLength={5}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CVC
              </label>
              <input
                type="text"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                placeholder="123"
                maxLength={3}
                className="input-field"
                required
              />
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={processing}
        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {processing ? '処理中...' : `¥${reservation.totalAmount.toLocaleString()}を支払う`}
      </button>

      <p className="text-xs text-gray-500 text-center">
        テストモードで動作しています（実際の請求は発生しません）
      </p>
    </form>
  );
}

// Stripe決済フォーム
function CheckoutForm({ reservation }: { reservation: Reservation }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError('');

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success?reservationId=${reservation.id}`,
      },
    });

    if (submitError) {
      setError(submitError.message || '決済に失敗しました');
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h3 className="font-bold text-gray-900 mb-4">予約内容</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">サービス:</span>
            <span className="font-medium">{reservation.service.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">日付:</span>
            <span className="font-medium">
              {format(new Date(reservation.date), 'yyyy年MM月dd日(E)', { locale: ja })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">時間:</span>
            <span className="font-medium">
              {reservation.startTime} - {reservation.endTime}
            </span>
          </div>
          <div className="flex justify-between pt-3 border-t border-gray-200">
            <span className="text-gray-900 font-bold">お支払い金額:</span>
            <span className="text-2xl font-bold text-pink-500">
              ¥{reservation.totalAmount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div>
        <label className="label mb-4">
          お支払い情報
        </label>
        <PaymentElement />
      </div>

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {processing ? '処理中...' : `¥${reservation.totalAmount.toLocaleString()}を支払う`}
      </button>

      <p className="text-xs text-gray-500 text-center">
        このサイトはStripeによって保護されています
      </p>
    </form>
  );
}

export default function PaymentPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const reservationId = params.reservationId as string;

  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [clientSecret, setClientSecret] = useState('');
  const [mockMode, setMockMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      fetchReservationAndCreatePaymentIntent();
    }
  }, [status, router, reservationId]);

  const fetchReservationAndCreatePaymentIntent = async () => {
    try {
      // 予約情報を取得
      const reservationsResponse = await fetch('/api/reservations');
      const reservations = await reservationsResponse.json();
      const foundReservation = reservations.find((r: Reservation) => r.id === reservationId);
      
      if (!foundReservation) {
        router.push('/dashboard');
        return;
      }

      setReservation(foundReservation);

      // Payment Intentを作成
      const paymentResponse = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservationId }),
      });

      const paymentData = await paymentResponse.json();
      setClientSecret(paymentData.clientSecret);
      setMockMode(paymentData.mockMode || false);
    } catch (error) {
      console.error('Failed to initialize payment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMockSuccess = () => {
    router.push(`/payment/success?reservationId=${reservationId}`);
  };

  if (status === 'loading' || loading || !reservation) {
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
              和の予約
            </Link>
            <Link href="/dashboard" className="text-gray-700 hover:text-pink-500 transition-colors">
              マイページに戻る
            </Link>
          </div>
        </nav>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            お支払い
          </h1>
          <p className="text-gray-600">
            {mockMode ? 'テストモードで決済を確認します' : '安全な決済でご予約を確定します'}
          </p>
        </div>

        <div className="card p-8">
          {mockMode ? (
            <MockPaymentForm reservation={reservation} onSuccess={handleMockSuccess} />
          ) : clientSecret ? (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: 'stripe',
                  variables: {
                    colorPrimary: '#ec4899',
                    colorBackground: '#ffffff',
                    colorText: '#1f2937',
                    colorDanger: '#ef4444',
                    fontFamily: 'Noto Sans JP, sans-serif',
                    borderRadius: '8px',
                  },
                },
                locale: 'ja',
              }}
            >
              <CheckoutForm reservation={reservation} />
            </Elements>
          ) : (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">決済を準備中...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
