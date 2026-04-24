import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              和の予約
            </Link>
            <div className="flex gap-4">
              <Link href="/auth/signin" className="px-4 py-2 text-gray-700 hover:text-pink-500 transition-colors">
                ログイン
              </Link>
              <Link href="/auth/signup" className="btn-primary">
                新規登録
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* ヒーローセクション */}
      <section className="relative bg-gradient-to-br from-pink-50 via-rose-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                心を込めた<br />
                <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                  おもてなし予約
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                24時間いつでもどこでも予約可能。<br />
                日本の美と心を大切にしたサービスをご提供します。
              </p>
              <div className="flex gap-4">
                <Link href="/services" className="btn-primary text-lg">
                  サービスを見る
                </Link>
                <Link href="/auth/signup" className="btn-secondary text-lg">
                  無料で始める
                </Link>
              </div>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=800&h=600&fit=crop"
                alt="和風の美容サロン - 心を込めたおもてなし"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* 特徴セクション */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
            選ばれる理由
          </h2>
          <p className="text-center text-gray-600 mb-16 text-lg">
            お客様に安心してご利用いただける機能が充実
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">24時間予約可能</h3>
              <p className="text-gray-600 leading-relaxed">
                営業時間を気にせず、いつでもお好きな時間に予約できます。
              </p>
            </div>

            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">安全な決済</h3>
              <p className="text-gray-600 leading-relaxed">
                Stripeによる安全なオンライン決済で、クレジットカード情報も安心。
              </p>
            </div>

            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">自動リマインド</h3>
              <p className="text-gray-600 leading-relaxed">
                予約日前日にメールでお知らせ。予約忘れの心配がありません。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTAセクション */}
      <section className="py-20 bg-gradient-to-r from-pink-500 to-rose-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            今すぐ始めましょう
          </h2>
          <p className="text-xl text-pink-50 mb-8">
            無料でアカウントを作成して、便利な予約システムをご利用ください
          </p>
          <Link href="/auth/signup" className="inline-block px-8 py-4 bg-white text-pink-500 font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 text-lg">
            無料で登録する
          </Link>
        </div>
      </section>

      {/* フッター */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">和の予約</h3>
              <p className="text-gray-400">
                心を込めたおもてなし予約サービス
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">リンク</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/services" className="hover:text-white transition-colors">サービス一覧</Link></li>
                <li><Link href="/auth/signin" className="hover:text-white transition-colors">ログイン</Link></li>
                <li><Link href="/auth/signup" className="hover:text-white transition-colors">新規登録</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">お問い合わせ</h4>
              <p className="text-gray-400">
                support@reservation-system.jp
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 和の予約. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
