# 🚀 Vercelデプロイガイド

## 前提条件

✅ GitHubにコードがプッシュされていること  
✅ リポジトリURL: `https://github.com/diamondcrypto0808-svg/reservation-system`

---

## ステップ1: Vercelアカウントのセットアップ

1. **Vercelにアクセス**
   - https://vercel.com にアクセス
   - `Sign Up` をクリック

2. **GitHubでサインイン**
   - `Continue with GitHub` を選択
   - `diamondcrypto0808-svg` アカウントでログイン
   - Vercelにリポジトリへのアクセスを許可

---

## ステップ2: プロジェクトのインポート

1. **新しいプロジェクトを作成**
   - Vercelダッシュボードで `Add New` → `Project` をクリック

2. **リポジトリを選択**
   - `reservation-system` を検索
   - `Import` をクリック

3. **プロジェクト設定**
   - **Project Name**: `reservation-system`（または任意の名前）
   - **Framework Preset**: Next.js（自動検出されます）
   - **Root Directory**: `./`（デフォルト）
   - **Build Command**: `npm run build`（デフォルト）
   - **Output Directory**: `.next`（デフォルト）

---

## ステップ3: 環境変数の設定

### 必須の環境変数

```bash
# NextAuth設定
NEXTAUTH_SECRET=your-secret-key-here-generate-random-string
NEXTAUTH_URL=https://your-app.vercel.app

# データベース（後で設定）
DATABASE_URL=postgresql://...
```

### NextAuth Secretの生成方法

ターミナルで以下を実行:
```bash
openssl rand -base64 32
```

または、オンラインで生成:
- https://generate-secret.vercel.app/32

### Stripe設定（オプション - 本番環境で使用する場合）

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**注意**: 開発中はStripeなしでも動作します（モックモード）

---

## ステップ4: データベースのセットアップ

### オプションA: Vercel Postgres（推奨）

1. **Storageタブを開く**
   - Vercelプロジェクトダッシュボードで `Storage` タブをクリック

2. **Postgresデータベースを作成**
   - `Create Database` をクリック
   - `Postgres` を選択
   - データベース名を入力（例: `reservation-db`）
   - リージョンを選択（日本の場合: `Tokyo (hnd1)`）
   - `Create` をクリック

3. **環境変数の自動設定**
   - Vercelが自動的に `DATABASE_URL` を設定します
   - プロジェクトを再デプロイ

### オプションB: 外部データベース（Supabase、PlanetScale等）

1. **データベースプロバイダーでアカウント作成**
   - Supabase: https://supabase.com
   - PlanetScale: https://planetscale.com
   - Neon: https://neon.tech

2. **接続文字列を取得**
   - PostgreSQL接続文字列をコピー

3. **Vercelに環境変数を追加**
   - `Settings` → `Environment Variables`
   - `DATABASE_URL` に接続文字列を貼り付け

---

## ステップ5: データベースマイグレーション

### 方法1: Vercel CLIを使用（推奨）

1. **Vercel CLIをインストール**
   ```bash
   npm i -g vercel
   ```

2. **ログイン**
   ```bash
   vercel login
   ```

3. **プロジェクトにリンク**
   ```bash
   vercel link
   ```

4. **環境変数を取得**
   ```bash
   vercel env pull .env.production
   ```

5. **マイグレーションを実行**
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

### 方法2: Prisma Data Platform

1. **Prisma Data Platformにアクセス**
   - https://cloud.prisma.io

2. **プロジェクトを作成**
   - データベース接続文字列を入力

3. **マイグレーションを実行**
   - UIからマイグレーションを実行

---

## ステップ6: デプロイ

1. **デプロイボタンをクリック**
   - Vercelが自動的にビルドとデプロイを開始

2. **ビルドログを確認**
   - エラーがないか確認
   - 通常2-3分で完了

3. **デプロイ完了**
   - デプロイが成功すると、URLが表示されます
   - 例: `https://reservation-system.vercel.app`

---

## ステップ7: 初期設定

1. **アプリにアクセス**
   - デプロイされたURLを開く

2. **管理者アカウントでログイン**
   - メール: `kubo@gmail.com`
   - パスワード: `kubo123456`

3. **動作確認**
   - サービス一覧が表示されるか確認
   - 予約機能が動作するか確認
   - 管理画面にアクセスできるか確認

---

## 🔧 トラブルシューティング

### ビルドエラー

**エラー**: `Module not found`
- **解決**: `package.json` の依存関係を確認
- 必要に応じて `npm install` を実行してコミット

**エラー**: `Prisma Client not generated`
- **解決**: `package.json` の `postinstall` スクリプトを確認
  ```json
  "scripts": {
    "postinstall": "prisma generate"
  }
  ```

### データベース接続エラー

**エラー**: `Can't reach database server`
- **解決**: `DATABASE_URL` が正しく設定されているか確認
- データベースが起動しているか確認

### 認証エラー

**エラー**: `[next-auth][error][NO_SECRET]`
- **解決**: `NEXTAUTH_SECRET` が設定されているか確認
- `NEXTAUTH_URL` がデプロイURLと一致しているか確認

---

## 📊 デプロイ後のチェックリスト

- [ ] アプリが正常に表示される
- [ ] ログイン機能が動作する
- [ ] サービス一覧が表示される
- [ ] 予約機能が動作する
- [ ] 管理画面にアクセスできる
- [ ] 決済機能が動作する（Stripe設定済みの場合）
- [ ] メール通知が送信される（メール設定済みの場合）

---

## 🎯 本番環境の推奨設定

### セキュリティ

1. **環境変数の確認**
   - すべての機密情報が環境変数に設定されているか
   - `.env` ファイルがGitにコミットされていないか

2. **HTTPS強制**
   - Vercelは自動的にHTTPSを有効化

3. **CORS設定**
   - 必要に応じて `next.config.mjs` でCORSを設定

### パフォーマンス

1. **画像最適化**
   - Next.js Image コンポーネントを使用

2. **キャッシング**
   - Vercel Edgeキャッシングが自動的に有効

3. **データベース接続プール**
   - Prismaの接続プール設定を確認

---

## 🔄 継続的デプロイ

Vercelは自動的に継続的デプロイを設定します：

- **mainブランチへのプッシュ** → 本番環境に自動デプロイ
- **他のブランチへのプッシュ** → プレビュー環境を自動作成

---

## 📞 サポートリソース

- **Vercelドキュメント**: https://vercel.com/docs
- **Next.jsドキュメント**: https://nextjs.org/docs
- **Prismaドキュメント**: https://www.prisma.io/docs

---

**プロジェクト**: 和の予約システム  
**技術スタック**: Next.js 14, TypeScript, Prisma, SQLite/PostgreSQL, Stripe  
**デプロイ先**: Vercel
