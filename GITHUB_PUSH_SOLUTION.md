# ✅ コードの準備完了！GitHubへのプッシュ方法

## 🎉 現在の状態

✅ **68ファイルがコミット済み** - すべてのコードがGitに保存されました  
✅ **リモートリポジトリ設定済み** - `https://github.com/diamondcrypto0808-svg/reservation-system.git`  
❌ **認証エラー** - 現在のGit設定が別のアカウント(qb-sol-tech)を使用しています

---

## 🚀 解決方法（3つの選択肢）

### 方法1: GitHub Desktop（最も簡単！推奨）

1. **GitHub Desktopをダウンロード**
   - https://desktop.github.com/ からダウンロード
   - インストールして起動

2. **アカウントでサインイン**
   - `diamondcrypto0808-svg` アカウントでサインイン

3. **リポジトリを追加**
   - `File` → `Add Local Repository`
   - フォルダを選択: `C:\Users\Sakura\Documents\Prototype`
   - `Add Repository` をクリック

4. **プッシュ**
   - 上部の `Publish repository` または `Push origin` ボタンをクリック
   - 完了！

---

### 方法2: Personal Access Token（コマンドライン）

1. **トークンを作成**
   - https://github.com/settings/tokens にアクセス
   - `Generate new token (classic)` をクリック
   - スコープで `repo` を選択
   - トークンをコピー（後で使用）

2. **リモートURLを更新**
   ```bash
   git remote set-url origin https://YOUR_TOKEN@github.com/diamondcrypto0808-svg/reservation-system.git
   ```
   `YOUR_TOKEN` を実際のトークンに置き換えてください

3. **プッシュ**
   ```bash
   git push -u origin main
   ```

---

### 方法3: 手動アップロード（最終手段）

1. **GitHubリポジトリにアクセス**
   - https://github.com/diamondcrypto0808-svg/reservation-system

2. **ファイルをアップロード**
   - `Add file` → `Upload files` をクリック
   - プロジェクトフォルダ内のすべてのファイルをドラッグ＆ドロップ
   - **注意**: `.env` ファイルは除外してください（機密情報が含まれています）
   - `Commit changes` をクリック

---

## 📋 次のステップ（GitHubプッシュ後）

プッシュが成功したら、Vercelにデプロイします：

### Vercelデプロイ手順

1. **Vercelにアクセス**
   - https://vercel.com にアクセス
   - GitHubアカウントでサインイン

2. **新しいプロジェクトをインポート**
   - `Add New` → `Project` をクリック
   - `reservation-system` リポジトリを選択
   - `Import` をクリック

3. **環境変数を設定**
   ```
   DATABASE_URL=（Vercel Postgresから取得）
   NEXTAUTH_SECRET=（ランダムな文字列）
   NEXTAUTH_URL=（Vercelが自動設定）
   
   # Stripe（オプション）
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

4. **デプロイ**
   - `Deploy` をクリック
   - 数分待つ

5. **データベースをセットアップ**
   - Vercelダッシュボードで `Storage` タブを開く
   - `Create Database` → `Postgres` を選択
   - 環境変数が自動的に設定されます

6. **マイグレーションを実行**
   - Vercelダッシュボードで `Settings` → `Functions` を開く
   - または、ローカルで実行:
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

---

## 🎯 推奨: 方法1（GitHub Desktop）

最も簡単で確実な方法は **GitHub Desktop** です。
- GUIで操作できる
- 認証が自動的に処理される
- エラーが発生しにくい

---

## 📞 サポート

問題が発生した場合は、以下を確認してください：
- GitHubアカウント `diamondcrypto0808-svg` でログインしているか
- リポジトリ `reservation-system` が作成されているか
- インターネット接続が安定しているか

---

**現在のプロジェクトディレクトリ**: `C:\Users\Sakura\Documents\Prototype`  
**GitHubリポジトリ**: `https://github.com/diamondcrypto0808-svg/reservation-system`
