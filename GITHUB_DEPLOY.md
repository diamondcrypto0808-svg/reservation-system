# 🚀 GitHub デプロイガイド

## 📋 現在の状態

✅ Gitリポジトリ初期化完了  
✅ すべてのファイルをコミット済み  
✅ ブランチ名を`main`に変更済み  
⚠️ GitHubリポジトリの作成が必要

---

## 🔧 GitHubリポジトリの作成手順

### ステップ1: GitHubにログイン

1. https://github.com にアクセス
2. アカウント `diamondcrypto0808-svg` でログイン

### ステップ2: 新しいリポジトリを作成

1. 右上の「+」アイコンをクリック
2. 「New repository」を選択

### ステップ3: リポジトリ設定

以下の情報を入力：

```
Repository name: reservation-system
Description: Japanese reservation system with Stripe payment integration
Visibility: Public または Private（お好みで）

⚠️ 重要: 以下のオプションは選択しないでください
❌ Add a README file
❌ Add .gitignore
❌ Choose a license
```

### ステップ4: リポジトリを作成

「Create repository」ボタンをクリック

---

## 💻 コマンドラインからプッシュ

リポジトリ作成後、以下のコマンドを実行：

### オプション1: HTTPS（推奨）

```bash
git remote set-url origin https://github.com/diamondcrypto0808-svg/reservation-system.git
git push -u origin main
```

初回プッシュ時、GitHubの認証情報を求められます：
- Username: `diamondcrypto0808-svg`
- Password: Personal Access Token（パスワードではありません）

### Personal Access Tokenの作成方法

1. GitHub → Settings → Developer settings
2. Personal access tokens → Tokens (classic)
3. Generate new token (classic)
4. 権限を選択:
   - ✅ repo（すべて）
5. Generate token
6. トークンをコピー（一度しか表示されません）

### オプション2: SSH

```bash
# SSH鍵を設定済みの場合
git remote set-url origin git@github.com:diamondcrypto0808-svg/reservation-system.git
git push -u origin main
```

---

## 🎯 プッシュ後の確認

### GitHubで確認

```
https://github.com/diamondcrypto0808-svg/reservation-system
```

以下が表示されていることを確認：
- ✅ 62ファイル
- ✅ README.md
- ✅ package.json
- ✅ すべてのソースコード

---

## 🌐 Vercelへのデプロイ（次のステップ）

### ステップ1: Vercelアカウント作成

1. https://vercel.com にアクセス
2. 「Sign Up」をクリック
3. 「Continue with GitHub」を選択
4. GitHubアカウントで認証

### ステップ2: プロジェクトをインポート

1. Vercelダッシュボードで「Add New...」→「Project」
2. GitHubリポジトリ一覧から `reservation-system` を選択
3. 「Import」をクリック

### ステップ3: プロジェクト設定

```
Framework Preset: Next.js
Root Directory: ./
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

### ステップ4: 環境変数を設定

「Environment Variables」セクションで以下を追加：

```env
# Database (Vercel Postgres推奨)
DATABASE_URL=postgresql://...

# NextAuth
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=ランダムな文字列

# Google OAuth（オプション）
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Stripe（オプション）
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email（オプション）
EMAIL_FROM=noreply@yourapp.com
```

### ステップ5: デプロイ

「Deploy」ボタンをクリック

数分後、デプロイが完了します！

---

## 🗄️ データベースのセットアップ

### オプション1: Vercel Postgres（推奨）

1. Vercelプロジェクトの「Storage」タブ
2. 「Create Database」→「Postgres」
3. データベース名を入力して作成
4. 環境変数が自動的に設定されます

### オプション2: Supabase（無料）

1. https://supabase.com でプロジェクト作成
2. Settings → Database → Connection string をコピー
3. Vercelの環境変数に `DATABASE_URL` を追加

### データベースマイグレーション

Vercel CLIを使用：

```bash
# Vercel CLIのインストール
npm i -g vercel

# ログイン
vercel login

# プロジェクトにリンク
vercel link

# 環境変数を取得
vercel env pull .env.production

# マイグレーション実行
npx prisma migrate deploy

# サンプルデータ投入
npm run db:seed
```

---

## 🔐 本番環境の設定

### 1. NextAuth URL更新

```env
NEXTAUTH_URL=https://your-app.vercel.app
```

### 2. Google OAuth設定

Google Cloud Consoleで承認済みリダイレクトURIを追加：
```
https://your-app.vercel.app/api/auth/callback/google
```

### 3. Stripe Webhook設定

Stripeダッシュボードで新しいWebhookエンドポイントを追加：
```
https://your-app.vercel.app/api/payments/webhook
```

イベント: `payment_intent.succeeded`

---

## 📊 デプロイ後の確認

### 1. サイトにアクセス

```
https://your-app.vercel.app
```

### 2. 動作確認

- ✅ トップページが表示される
- ✅ サービス一覧が表示される
- ✅ ログインできる
- ✅ 予約作成できる

### 3. 管理者ログイン

```
メール: kubo@gmail.com
パスワード: kubo123456
```

---

## 🔄 継続的デプロイ

GitHubにプッシュすると自動的にVercelにデプロイされます：

```bash
# コード変更後
git add .
git commit -m "Update: 変更内容"
git push origin main
```

数分後、自動的に本番環境に反映されます！

---

## 🎉 完了！

### デプロイ完了後のURL

```
本番環境: https://your-app.vercel.app
管理画面: https://your-app.vercel.app/admin
```

### 次のステップ

1. ✅ カスタムドメインの設定
2. ✅ Stripe本番モードへの切り替え
3. ✅ メール送信サービスの統合
4. ✅ パフォーマンス最適化

---

## 📚 関連ドキュメント

- `DEPLOY.md` - 詳細なデプロイガイド
- `STRIPE_SETUP.md` - Stripe設定ガイド
- `README.md` - プロジェクト概要

---

## 🆘 トラブルシューティング

### ビルドエラー

```bash
# ローカルでビルドテスト
npm run build
```

### データベース接続エラー

- DATABASE_URLが正しく設定されているか確認
- Prismaマイグレーションが実行されているか確認

### 認証エラー

- NEXTAUTH_SECRETが設定されているか確認
- NEXTAUTH_URLが正しいか確認

---

## 📞 サポート

問題が発生した場合：
1. Vercelのログを確認
2. ブラウザのコンソールを確認
3. `DEPLOY.md`の詳細ガイドを参照

---

**GitHubへのプッシュ準備が完了しています！**

上記の手順に従って、GitHubリポジトリを作成してプッシュしてください 🚀
