'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const reservationId = searchParams.get('reservationId');

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="card p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            お支払い完了
          </h1>
          
          <p className="text-gray-600 mb-8 leading-relaxed">
            ご予約ありがとうございます。<br />
            お支払いが正常に完了しました。<br />
            予約確認メールをお送りしましたのでご確認ください。
          </p>

          <div className="space-y-3">
            <Link
              href="/dashboard"
              className="block w-full btn-primary"
            >
              マイページで確認
            </Link>
            <Link
              href="/services"
              className="block w-full btn-secondary"
            >
              他のサービスを見る
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
