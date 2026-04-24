# クイックスタートガイド

## 🚀 すぐに始める

開発サーバーは既に起動しています！

**アクセス**: http://localhost:3000

## 📝 現在の状態

✅ 依存関係インストール済み  
✅ Prisma Client生成済み  
✅ 開発サーバー起動中  
⚠️ データベース未設定（PostgreSQLが必要）

## 🗄️ データベースのセットアップ

### オプション1: ローカルPostgreSQL（推奨）

1. PostgreSQLをインストール
2. データベースを作成:
```bash
# PostgreSQLに接続
psql -U postgres

# データベース作成
CREATE DATABASE reservation_db;
```

3. マイグレーション実行:
```bash
npx prisma migrate dev --name init
```

4. サンプルデータ投入:
```bash
npm run db:seed
```

### オプション2: クラウドデータベース（簡単）

**Supabase（無料）を使用:**

1. https://supabase.com でアカウント作成
2. 新しいプロジェクトを作成
3. Settings → Database → Connection string をコピー
4. `.env`ファイルの`DATABASE_URL`を更新:
```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[YOUR-HOST]:5432/postgres"
```

5. マイグレーション実行:
```bash
npx prisma migrate deploy
npm run db:seed
```

## 🔑 ログイン情報

サンプルデータ投入後、以下のアカウントが使用できます：

**管理者アカウント:**
- メール: `kubo@gmail.com`
- パスワード: `kubo123456`
- アクセス: http://localhost:3000/admin

**一般ユーザー:**
- 新規登録から作成してください

## 💳 決済テスト

Stripeのテストモードを使用する場合：

1. https://stripe.com でアカウント作成
2. ダッシュボード → 開発者 → APIキー
3. `.env`ファイルを更新:
```env
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

**テストカード情報:**
- カード番号: `4242 4242 4242 4242`
- 有効期限: 任意の未来の日付
- CVC: 任意の3桁

## 🔐 Google OAuth（オプション）

1. https://console.cloud.google.com でプロジェクト作成
2. OAuth 2.0クライアントID作成
3. リダイレクトURI追加: `http://localhost:3000/api/auth/callback/google`
4. `.env`ファイルを更新

## 📱 主な機能

### ユーザー向け
- ✅ トップページ: http://localhost:3000
- ✅ サービス一覧: http://localhost:3000/services
- ✅ ユーザー登録: http://localhost:3000/auth/signup
- ✅ ログイン: http://localhost:3000/auth/signin
- ✅ マイページ: http://localhost:3000/dashboard

### 管理者向け
- ✅ 管理画面: http://localhost:3000/admin
- ✅ サービス管理: http://localhost:3000/admin/services
- ✅ ユーザー管理: http://localhost:3000/admin/users

## 🛠️ 開発コマンド

```bash
# 開発サーバー起動（既に起動中）
npm run dev

# データベースマイグレーション
npx prisma migrate dev

# Prisma Studio（データベースGUI）
npm run db:studio

# サンプルデータ投入
npm run db:seed
```

## ⚠️ トラブルシューティング

### データベース接続エラー
```
Error: P1001: Can't reach database server
```
→ PostgreSQLが起動しているか確認、または`.env`の`DATABASE_URL`を確認

### 認証エラー
```
[next-auth][error]
```
→ `.env`の`NEXTAUTH_SECRET`が設定されているか確認

### ポート使用中エラー
```
Port 3000 is already in use
```
→ 別のポートを使用: `npm run dev -- -p 3001`

## 📚 詳細ドキュメント

- [README.md](./README.md) - プロジェクト概要
- [SETUP.md](./SETUP.md) - 詳細セットアップ手順
- [DEPLOY.md](./DEPLOY.md) - 本番環境デプロイ

## 💡 次のステップ

1. データベースをセットアップ
2. サンプルデータを投入
3. http://localhost:3000 にアクセス
4. 新規ユーザー登録してサービスを予約
5. 管理者アカウントでログインして管理画面を確認

## 🎨 カスタマイズ

- **色の変更**: `tailwind.config.ts`
- **フォント変更**: `app/globals.css`
- **サービス追加**: 管理画面から追加可能
- **メール設定**: `lib/email.ts`（SendGrid等の統合）

---

**開発サーバーは既に起動しています！**  
ブラウザで http://localhost:3000 を開いてください 🎉
