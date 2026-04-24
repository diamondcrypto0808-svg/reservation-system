# 🚀 今すぐプッシュする方法

## 🎯 最も簡単な方法

### オプション1: GitHub Desktop（推奨）

#### 1. GitHub Desktop をダウンロード
```
https://desktop.github.com/
```

#### 2. インストールして起動

#### 3. 正しいアカウントでログイン
- File → Options → Accounts
- Sign in with `diamondcrypto0808-svg`

#### 4. リポジトリを追加
- File → Add local repository
- Choose: `C:\Users\Sakura\Documents\Prototype`

#### 5. Publish
- 「Publish repository」ボタンをクリック
- ✅ 完了！

---

### オプション2: Personal Access Token

#### ステップ1: トークンを作成

1. GitHubにアクセス（diamondcrypto0808-svgでログイン）
   ```
   https://github.com/settings/tokens
   ```

2. 「Generate new token」→「Generate new token (classic)」

3. 設定:
   - Note: `Reservation System`
   - Expiration: `90 days`
   - Scopes: ✅ `repo` (すべてチェック)

4. 「Generate token」をクリック

5. トークンをコピー（例: `ghp_xxxxxxxxxxxx`）

#### ステップ2: PowerShellで実行

```powershell
# トークンを変数に設定（YOUR_TOKENを実際のトークンに置き換え）
$token = "YOUR_TOKEN_HERE"

# リモートURLを更新
git remote set-url origin "https://$token@github.com/diamondcrypto0808-svg/reservation-system.git"

# プッシュ
git push -u origin main
```

✅ 成功！

---

### オプション3: コマンド1行で実行

Personal Access Tokenを取得したら、以下を実行:

```powershell
git remote set-url origin https://YOUR_TOKEN@github.com/diamondcrypto0808-svg/reservation-system.git && git push -u origin main
```

`YOUR_TOKEN` を実際のトークンに置き換えてください。

---

## 📋 トークンの取得手順（詳細）

### 1. GitHubにログイン
```
https://github.com/login
```
アカウント: `diamondcrypto0808-svg`

### 2. Settings に移動
右上のプロフィール画像 → Settings

### 3. Developer settings
左メニューの一番下 → Developer settings

### 4. Personal access tokens
Personal access tokens → Tokens (classic)

### 5. Generate new token
「Generate new token (classic)」をクリック

### 6. 設定
```
Note: Reservation System Deploy
Expiration: 90 days
Select scopes:
  ✅ repo
    ✅ repo:status
    ✅ repo_deployment
    ✅ public_repo
    ✅ repo:invite
    ✅ security_events
```

### 7. Generate
「Generate token」をクリック

### 8. コピー
トークンをコピー（`ghp_` で始まる文字列）
⚠️ 一度しか表示されないので必ずコピー！

---

## 🎯 プッシュコマンド

トークンを取得したら:

```powershell
# 例: トークンが ghp_abc123xyz の場合
git remote set-url origin https://ghp_abc123xyz@github.com/diamondcrypto0808-svg/reservation-system.git
git push -u origin main
```

---

## ✅ 成功の確認

プッシュ成功後、以下にアクセス:
```
https://github.com/diamondcrypto0808-svg/reservation-system
```

以下が表示されていれば成功:
- ✅ すべてのファイル
- ✅ README.md
- ✅ 約60ファイル

---

## 🌐 次のステップ: Vercel デプロイ

### 1. Vercelにアクセス
```
https://vercel.com
```

### 2. GitHubでログイン
「Continue with GitHub」

### 3. プロジェクトをインポート
- 「Add New...」→「Project」
- `reservation-system` を選択
- 「Import」

### 4. 環境変数を設定
```env
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=ランダムな文字列
DATABASE_URL=postgresql://...
```

### 5. Deploy
「Deploy」ボタンをクリック

---

## 🎉 完了！

### 本番環境
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

## 💡 ヒント

### GitHub Desktop が最も簡単
- ✅ GUIで操作
- ✅ 認証が簡単
- ✅ エラーが少ない

### Personal Access Token
- ✅ コマンドラインで完結
- ✅ 自動化可能
- ⚠️ トークンの管理が必要

---

**今すぐ始めましょう！** 🚀

推奨: GitHub Desktop をダウンロードして使用
https://desktop.github.com/
