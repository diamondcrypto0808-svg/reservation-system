# 予約管理システム

Next.js + TypeScript + PostgreSQL + Stripeを使用した完全な予約管理システムです。

## 主な機能

### ユーザー向け機能
- ✅ ユーザー登録・ログイン認証（メール + Googleログイン）
- ✅ サービス一覧表示
- ✅ 予約フォーム・予約管理機能
- ✅ マイページ（予約一覧・ステータス確認）
- ✅ Stripeによるオンライン決済
- ✅ メール通知機能（予約確認・リマインド）
- ✅ レスポンシブ対応

### 管理者向け機能
- ✅ 管理者ダッシュボード
- ✅ 予約一覧・管理
- ✅ ユーザー管理
- ✅ サービス管理
- ✅ 売上確認

## 技術スタック

- **フロントエンド**: Next.js 14, React, TypeScript, Tailwind CSS
- **バックエンド**: Next.js API Routes
- **データベース**: PostgreSQL (Prisma ORM)
- **認証**: NextAuth.js (メール + Google OAuth)
- **決済**: Stripe
- **メール**: Nodemailer
- **デプロイ**: Vercel推奨

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.example`を`.env`にコピーして、必要な環境変数を設定してください。

```bash
cp .env.example .env
```

必要な環境変数：
- `DATABASE_URL`: PostgreSQLの接続URL
- `NEXTAUTH_SECRET`: NextAuthのシークレットキー
- `GOOGLE_CLIENT_ID`: Google OAuthのクライアントID
- `GOOGLE_CLIENT_SECRET`: Google OAuthのクライアントシークレット
- `STRIPE_SECRET_KEY`: Stripeのシークレットキー
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Stripeの公開可能キー
- `EMAIL_SERVER_*`: メール送信用のSMTP設定

### 3. データベースのセットアップ

```bash
# Prismaマイグレーションの実行
npx prisma migrate dev

# Prisma Clientの生成
npx prisma generate
```

### 4. 初期データの投入（オプション）

管理者ユーザーとサンプルサービスを作成する場合：

```bash
npx prisma studio
```

Prisma Studioで以下を手動で作成：
- 管理者ユーザー（role: ADMIN）
- サンプルサービス

### 5. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開いてください。

## Stripe Webhookの設定

本番環境では、Stripeのwebhookエンドポイントを設定する必要があります：

1. Stripeダッシュボードで新しいwebhookエンドポイントを作成
2. URL: `https://your-domain.com/api/payments/webhook`
3. イベント: `payment_intent.succeeded`を選択
4. Webhook署名シークレットを`.env`の`STRIPE_WEBHOOK_SECRET`に設定

開発環境では、Stripe CLIを使用してwebhookをテストできます：

```bash
stripe listen --forward-to localhost:3000/api/payments/webhook
```

## デプロイ

### Vercelへのデプロイ

1. GitHubリポジトリにプッシュ
2. Vercelでプロジェクトをインポート
3. 環境変数を設定
4. デプロイ

### データベース

本番環境では以下のPostgreSQLホスティングサービスを推奨：
- Vercel Postgres
- Supabase
- Railway
- Neon

## プロジェクト構造

```
├── app/
│   ├── api/              # API Routes
│   ├── auth/             # 認証ページ
│   ├── admin/            # 管理画面
│   ├── booking/          # 予約フォーム
│   ├── dashboard/        # ユーザーダッシュボード
│   ├── payment/          # 決済ページ
│   └── services/         # サービス一覧
├── lib/
│   ├── auth.ts           # NextAuth設定
│   ├── email.ts          # メール送信機能
│   ├── prisma.ts         # Prismaクライアント
│   └── stripe.ts         # Stripe設定
├── prisma/
│   └── schema.prisma     # データベーススキーマ
└── types/
    └── next-auth.d.ts    # TypeScript型定義
```

## デザイン

- **カラースキーム**: ピンク・ローズ系のグラデーション
- **フォント**: Noto Sans JP（日本語最適化）
- **スタイル**: モダンでクリーンなフラットデザイン
- **レスポンシブ**: モバイルファーストデザイン

## ライセンス

MIT License
