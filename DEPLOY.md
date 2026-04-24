# デプロイガイド

このガイドでは、予約管理システムをVercelにデプロイする手順を説明します。

## Vercelへのデプロイ

### 前提条件

- GitHubアカウント
- Vercelアカウント（無料プランで可）
- 設定済みのStripeアカウント
- PostgreSQLデータベース（Vercel Postgres推奨）

### ステップ1: GitHubリポジトリの準備

1. GitHubで新しいリポジトリを作成
2. ローカルのコードをプッシュ

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
```

### ステップ2: Vercelプロジェクトの作成

1. [Vercel Dashboard](https://vercel.com/dashboard)にアクセス
2. 「New Project」をクリック
3. GitHubリポジトリをインポート
4. プロジェクト設定：
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: .next

### ステップ3: データベースのセットアップ

#### Vercel Postgresを使用する場合

1. Vercelプロジェクトの「Storage」タブに移動
2. 「Create Database」→「Postgres」を選択
3. データベース名を入力して作成
4. 自動的に環境変数が設定されます

#### 外部データベースを使用する場合

Supabase、Railway、Neonなどのサービスでデータベースを作成し、接続URLを取得します。

### ステップ4: 環境変数の設定

Vercelプロジェクトの「Settings」→「Environment Variables」で以下を設定：

```env
# Database
DATABASE_URL=postgresql://...

# NextAuth
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-secret-key

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Stripe
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@yourapp.com
```

**重要**: 本番環境ではStripeのライブモードキーを使用してください。

### ステップ5: データベースマイグレーション

Vercelにデプロイ後、データベースマイグレーションを実行する必要があります。

#### 方法1: ローカルから実行

```bash
# 本番データベースのURLを使用
DATABASE_URL="postgresql://..." npx prisma migrate deploy
DATABASE_URL="postgresql://..." npm run db:seed
```

#### 方法2: Vercel CLIを使用

```bash
# Vercel CLIのインストール
npm i -g vercel

# ログイン
vercel login

# プロジェクトにリンク
vercel link

# マイグレーション実行
vercel env pull .env.production
npx prisma migrate deploy
```

### ステップ6: Google OAuthの設定更新

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. OAuth 2.0クライアントIDの設定を開く
3. 承認済みのリダイレクトURIに追加：
   ```
   https://your-app.vercel.app/api/auth/callback/google
   ```

### ステップ7: Stripe Webhookの設定

1. [Stripe Dashboard](https://dashboard.stripe.com/)の「開発者」→「Webhook」に移動
2. 「エンドポイントを追加」をクリック
3. エンドポイントURL: `https://your-app.vercel.app/api/payments/webhook`
4. リッスンするイベント: `payment_intent.succeeded`を選択
5. 署名シークレットをコピーしてVercelの環境変数に設定

### ステップ8: デプロイの確認

1. Vercelが自動的にビルドとデプロイを実行
2. デプロイが完了したら、URLにアクセスして動作確認
3. 以下の機能をテスト：
   - ユーザー登録・ログイン
   - サービス一覧表示
   - 予約作成
   - 決済処理
   - メール送信
   - 管理画面

## カスタムドメインの設定

### ステップ1: ドメインの追加

1. Vercelプロジェクトの「Settings」→「Domains」に移動
2. カスタムドメインを追加
3. DNSレコードを設定（Vercelが指示を表示）

### ステップ2: 環境変数の更新

```env
NEXTAUTH_URL=https://your-custom-domain.com
```

### ステップ3: OAuth設定の更新

Google OAuthとStripe Webhookの設定で、新しいドメインを追加します。

## パフォーマンス最適化

### 画像最適化

Next.jsの画像最適化を活用するため、`next.config.mjs`で許可するドメインを設定：

```javascript
images: {
  domains: ['images.unsplash.com', 'your-cdn.com'],
  formats: ['image/avif', 'image/webp'],
}
```

### キャッシング

Vercelは自動的に静的アセットをキャッシュしますが、APIルートのキャッシュも設定できます：

```typescript
export const revalidate = 60; // 60秒ごとに再検証
```

### データベース接続プーリング

Prismaの接続プーリングを有効化：

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

## モニタリングとログ

### Vercel Analytics

1. プロジェクトの「Analytics」タブで有効化
2. パフォーマンスメトリクスを確認

### エラートラッキング

Sentryなどのエラートラッキングサービスの統合を推奨：

```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

### ログ確認

Vercelダッシュボードの「Logs」タブでリアルタイムログを確認できます。

## セキュリティ

### 環境変数の保護

- 本番環境の環境変数は絶対にコミットしない
- `.env.local`をgitignoreに追加済み

### HTTPS強制

Vercelは自動的にHTTPSを有効化しますが、追加設定も可能：

```typescript
// middleware.ts
if (process.env.NODE_ENV === 'production' && !req.url.startsWith('https')) {
  return NextResponse.redirect(`https://${req.headers.get('host')}${req.url}`);
}
```

### レート制限

API Routesにレート制限を実装することを推奨：

```bash
npm install @upstash/ratelimit @upstash/redis
```

## バックアップ

### データベースバックアップ

定期的なバックアップを設定：

- Vercel Postgres: 自動バックアップが有効
- Supabase: 自動バックアップが有効
- 手動バックアップ: `pg_dump`を使用

```bash
pg_dump $DATABASE_URL > backup.sql
```

## トラブルシューティング

### ビルドエラー

```
Error: Cannot find module
```

解決方法：
- `package.json`の依存関係を確認
- `npm install`を実行してから再デプロイ

### データベース接続エラー

```
Error: P1001: Can't reach database server
```

解決方法：
- DATABASE_URLが正しく設定されているか確認
- データベースのIPホワイトリストを確認（Vercelの場合は不要）

### Webhook検証エラー

```
Webhook signature verification failed
```

解決方法：
- STRIPE_WEBHOOK_SECRETが正しいか確認
- Stripeダッシュボードでwebhookエンドポイントを確認

## 継続的デプロイ

Vercelは自動的にGitHubと連携し、以下の動作をします：

- `main`ブランチへのプッシュ → 本番環境にデプロイ
- プルリクエスト → プレビュー環境を自動作成
- コミットごとにビルドとテストを実行

## コスト管理

### Vercelの料金プラン

- Hobby（無料）: 個人プロジェクト向け
- Pro（$20/月）: 商用プロジェクト向け
- Enterprise: 大規模プロジェクト向け

### データベースコスト

- Vercel Postgres: 使用量に応じた課金
- Supabase: 無料プランあり
- Railway: 使用量に応じた課金

## サポート

デプロイに関する問題が発生した場合：
- [Vercelドキュメント](https://vercel.com/docs)を参照
- [Vercelコミュニティ](https://github.com/vercel/vercel/discussions)で質問
- プロジェクトのIssueを作成
