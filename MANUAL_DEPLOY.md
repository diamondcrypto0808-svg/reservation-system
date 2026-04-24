# 🚀 手動デプロイガイド

## ⚠️ 現在の状況

GitHubの認証で別のアカウント（qb-sol-tech）が使用されています。
正しいアカウント（diamondcrypto0808-svg）でプッシュする必要があります。

---

## 🔧 解決方法

### オプション1: GitHub Desktop を使用（最も簡単）

#### ステップ1: GitHub Desktop をインストール
1. https://desktop.github.com/ からダウンロード
2. インストールして起動

#### ステップ2: 正しいアカウントでログイン
1. File → Options → Accounts
2. 「Sign in」をクリック
3. `diamondcrypto0808-svg` アカウントでログイン

#### ステップ3: リポジトリを追加
1. File → Add local repository
2. フォルダを選択: `C:\Users\Sakura\Documents\Prototype`
3. 「Add repository」をクリック

#### ステップ4: プッシュ
1. 上部の「Publish repository」をクリック
2. リポジトリ名: `reservation-system`
3. 「Publish repository」をクリック

✅ 完了！

---

### オプション2: Personal Access Token を使用

#### ステップ1: Personal Access Token を作成

1. GitHubにログイン（diamondcrypto0808-svg）
2. Settings → Developer settings → Personal access tokens → Tokens (classic)
3. 「Generate new token (classic)」をクリック
4. 設定:
   ```
   Note: Reservation System Deploy
   Expiration: 90 days
   Scopes: ✅ repo (すべて)
   ```
5. 「Generate token」をクリック
6. トークンをコピー（一度しか表示されません）

#### ステップ2: トークンを使用してプッシュ

PowerShellで以下を実行:

```powershell
# リモートURLをトークン付きに変更
git remote set-url origin https://YOUR_TOKEN@github.com/diamondcrypto0808-svg/reservation-system.git

# プッシュ
git push -u origin main
```

`YOUR_TOKEN` を実際のトークンに置き換えてください。

---

### オプション3: SSH を使用

#### ステップ1: SSH鍵を生成

```powershell
ssh-keygen -t ed25519 -C "diamondcrypto0808@gmail.com"
```

Enter を3回押す（パスフレーズなし）

#### ステップ2: SSH鍵をGitHubに追加

```powershell
# 公開鍵をクリップボードにコピー
Get-Content ~/.ssh/id_ed25519.pub | Set-Clipboard
```

1. GitHub → Settings → SSH and GPG keys
2. 「New SSH key」をクリック
3. Title: "Reservation System"
4. Key: Ctrl+V で貼り付け
5. 「Add SSH key」をクリック

#### ステップ3: リモートURLを変更してプッシュ

```powershell
git remote set-url origin git@github.com:diamondcrypto0808-svg/reservation-system.git
git push -u origin main
```

---

### オプション4: 手動でファイルをアップロード

#### ステップ1: リポジトリページを開く
```
https://github.com/diamondcrypto0808-svg/reservation-system
```

#### ステップ2: ファイルをアップロード
1. 「Add file」→「Upload files」をクリック
2. すべてのファイルをドラッグ&ドロップ
   - ⚠️ 除外: `.git`, `node_modules`, `prisma/dev.db`, `.env`
3. Commit message: "Initial commit: Japanese reservation system"
4. 「Commit changes」をクリック

---

## 📋 アップロードするファイル一覧

### 必須ファイル
```
✅ app/
✅ components/
✅ lib/
✅ prisma/
✅ public/
✅ scripts/
✅ types/
✅ .env.example
✅ .gitignore
✅ middleware.ts
✅ next.config.mjs
✅ package.json
✅ package-lock.json
✅ postcss.config.mjs
✅ tailwind.config.ts
✅ tsconfig.json
✅ README.md
```

### ドキュメント
```
✅ DEPLOY.md
✅ SETUP.md
✅ QUICKSTART.md
✅ STRIPE_SETUP.md
✅ GITHUB_DEPLOY.md
✅ その他の.mdファイル
```

### 除外するファイル
```
❌ .git/
❌ node_modules/
❌ .next/
❌ prisma/dev.db
❌ .env
```

---

## ✅ プッシュ成功後の確認

### 1. GitHubリポジトリを確認
```
https://github.com/diamondcrypto0808-svg/reservation-system
```

以下が表示されていることを確認:
- ✅ すべてのソースコード
- ✅ README.md
- ✅ package.json
- ✅ 約60ファイル

### 2. Vercelにデプロイ

#### ステップ1: Vercelにアクセス
```
https://vercel.com
```

#### ステップ2: GitHubでログイン
1. 「Sign Up」または「Log In」
2. 「Continue with GitHub」
3. `diamondcrypto0808-svg` アカウントで認証

#### ステップ3: プロジェクトをインポート
1. 「Add New...」→「Project」
2. GitHubリポジトリ一覧から `reservation-system` を選択
3. 「Import」をクリック

#### ステップ4: 環境変数を設定

以下の環境変数を追加:

```env
# NextAuth（必須）
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=ランダムな文字列を生成

# Database（Vercel Postgresを使用）
DATABASE_URL=postgresql://...

# Stripe（オプション - テストモードで動作）
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Google OAuth（オプション）
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

#### ステップ5: デプロイ
「Deploy」ボタンをクリック

---

## 🗄️ データベースのセットアップ

### Vercel Postgres（推奨）

1. Vercelプロジェクトの「Storage」タブ
2. 「Create Database」→「Postgres」
3. データベース名: `reservation-db`
4. 「Create」をクリック
5. 環境変数が自動的に設定されます

### マイグレーションとシード

Vercel CLIを使用:

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

## 🎉 デプロイ完了！

### 本番環境URL
```
https://your-app.vercel.app
```

### 管理画面
```
https://your-app.vercel.app/admin
メール: kubo@gmail.com
パスワード: kubo123456
```

---

## 🔄 今後の更新

コードを変更した後:

```bash
git add .
git commit -m "Update: 変更内容"
git push origin main
```

Vercelが自動的に再デプロイします！

---

## 📞 サポート

問題が発生した場合:
1. GitHub Desktop を使用（最も簡単）
2. Personal Access Token を使用
3. 手動でファイルをアップロード

詳細は上記の各オプションを参照してください。

---

**推奨: GitHub Desktop を使用するのが最も簡単です！** 🚀
