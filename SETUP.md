# セットアップガイド

このガイドでは、予約管理システムを最初から立ち上げる手順を説明します。

## 前提条件

以下がインストールされていることを確認してください：
- Node.js 18以上
- PostgreSQL 14以上
- npm または yarn

## ステップ1: 依存関係のインストール

```bash
npm install
```

## ステップ2: PostgreSQLデータベースの準備

### ローカル環境の場合

PostgreSQLをインストールし、新しいデータベースを作成します：

```bash
# PostgreSQLに接続
psql -U postgres

# データベースを作成
CREATE DATABASE reservation_db;

# ユーザーを作成（オプション）
CREATE USER reservation_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE reservation_db TO reservation_user;
```

### クラウドデータベースの場合

以下のいずれかのサービスを使用できます：
- **Vercel Postgres**: Vercelプロジェクトから直接作成
- **Supabase**: https://supabase.com でプロジェクトを作成
- **Railway**: https://railway.app でPostgreSQLを追加
- **Neon**: https://neon.tech で無料プランを利用

## ステップ3: 環境変数の設定

`.env.example`を`.env`にコピーします：

```bash
cp .env.example .env
```

`.env`ファイルを編集して、以下の値を設定します：

### データベース接続

```env
DATABASE_URL="postgresql://user:password@localhost:5432/reservation_db?schema=public"
```

### NextAuth設定

```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="ランダムな文字列を生成してください"
```

NextAuthシークレットの生成：
```bash
openssl rand -base64 32
```

### Google OAuth設定

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 新しいプロジェクトを作成
3. 「APIとサービス」→「認証情報」に移動
4. 「OAuth 2.0 クライアントID」を作成
5. 承認済みのリダイレクトURIに以下を追加：
   - `http://localhost:3000/api/auth/callback/google`（開発環境）
   - `https://your-domain.com/api/auth/callback/google`（本番環境）

```env
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### Stripe設定

1. [Stripe Dashboard](https://dashboard.stripe.com/)にアクセス
2. 「開発者」→「APIキー」に移動
3. テストモードのキーをコピー

```env
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

Webhook設定（後で設定）：
```env
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### メール設定（Gmail使用の場合）

1. Googleアカウントの2段階認証を有効化
2. [アプリパスワード](https://myaccount.google.com/apppasswords)を生成

```env
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@yourapp.com"
```

## ステップ4: データベースのセットアップ

Prismaマイグレーションを実行してテーブルを作成します：

```bash
npx prisma migrate dev --name init
```

## ステップ5: 初期データの投入

サンプルデータ（管理者ユーザーとサービス）を作成します：

```bash
npm run db:seed
```

これにより以下が作成されます：
- 管理者アカウント
  - メール: `kubo@gmail.com`
  - パスワード: `kubo123456`
- 6つのサンプルサービス

## ステップ6: 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開きます。

## ステップ7: 動作確認

### ユーザー機能のテスト

1. トップページにアクセス
2. 「新規登録」からアカウントを作成
3. 「サービス一覧」からサービスを選択
4. 予約フォームで日時を選択
5. 決済ページでテストカード情報を入力：
   - カード番号: `4242 4242 4242 4242`
   - 有効期限: 任意の未来の日付
   - CVC: 任意の3桁
   - 郵便番号: 任意

### 管理者機能のテスト

1. http://localhost:3000/auth/signin にアクセス
2. 管理者アカウントでログイン
   - メール: `kubo@gmail.com`
   - パスワード: `kubo123456`
3. http://localhost:3000/admin にアクセス
4. ダッシュボードで予約状況を確認

## ステップ8: Stripe Webhookの設定（開発環境）

開発環境でStripe webhookをテストするには、Stripe CLIを使用します：

```bash
# Stripe CLIのインストール
# macOS
brew install stripe/stripe-cli/stripe

# Windows
scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
scoop install stripe

# ログイン
stripe login

# Webhookのリッスン
stripe listen --forward-to localhost:3000/api/payments/webhook
```

表示されたwebhook署名シークレットを`.env`に追加：
```env
STRIPE_WEBHOOK_SECRET="whsec_..."
```

## トラブルシューティング

### データベース接続エラー

```
Error: P1001: Can't reach database server
```

解決方法：
- PostgreSQLが起動しているか確認
- DATABASE_URLが正しいか確認
- ファイアウォール設定を確認

### Prismaエラー

```
Error: Schema engine error
```

解決方法：
```bash
npx prisma generate
npx prisma migrate reset
```

### NextAuthエラー

```
[next-auth][error][SIGNIN_EMAIL_ERROR]
```

解決方法：
- NEXTAUTH_SECRETが設定されているか確認
- NEXTAUTH_URLが正しいか確認

### Stripeエラー

```
No such payment_intent
```

解決方法：
- Stripeのテストモードを使用しているか確認
- APIキーが正しいか確認

## 次のステップ

- [README.md](./README.md)でプロジェクト全体の概要を確認
- カスタマイズ方法については各コンポーネントのコメントを参照
- 本番環境へのデプロイについては「デプロイガイド」を参照

## サポート

問題が発生した場合は、以下を確認してください：
- すべての環境変数が正しく設定されているか
- Node.jsとPostgreSQLのバージョンが要件を満たしているか
- ログファイルでエラーメッセージを確認
