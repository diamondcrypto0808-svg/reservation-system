# 💳 Stripe決済機能セットアップガイド

## 🎯 現在の状態

### ✅ 実装済み機能

1. **モックモード（テストモード）**
   - Stripeキー未設定でも動作
   - テストカード番号で決済テスト可能
   - 実際の請求は発生しない

2. **本番モード**
   - 実際のStripe APIを使用
   - 本物のクレジットカード決済
   - Webhook処理

### 🧪 現在の動作モード

**モックモード（テストモード）で動作中**

Stripeの実際のAPIキーが設定されていないため、テストモードで動作しています。
- ✅ 決済フローのテストが可能
- ✅ 予約確定まで完全に動作
- ⚠️ 実際の請求は発生しません

---

## 🚀 モックモードでのテスト方法

### 1. ログイン
```
http://localhost:3000/auth/signin
メール: kubo@gmail.com
パスワード: kubo123456
```

### 2. サービスを選択
```
http://localhost:3000/services
```

### 3. 予約を作成
- 日時を選択
- 「予約を確定する」をクリック

### 4. 決済ページ
自動的に決済ページにリダイレクトされます。

**テストカード情報:**
```
カード番号: 4242 4242 4242 4242
有効期限: 12/34（任意の未来の日付）
CVC: 123（任意の3桁）
```

### 5. 決済実行
「支払う」ボタンをクリックすると：
- 2秒間の処理シミュレーション
- 決済成功
- 予約確定
- 成功ページにリダイレクト

---

## 🔧 Stripe本番モードへの移行

### ステップ1: Stripeアカウント作成

1. https://stripe.com にアクセス
2. 「今すぐ始める」をクリック
3. アカウント情報を入力して登録

### ステップ2: APIキーを取得

1. Stripeダッシュボードにログイン
2. 左メニュー「開発者」→「APIキー」をクリック
3. **テストモード**のキーをコピー：
   - 公開可能キー（pk_test_...）
   - シークレットキー（sk_test_...）

### ステップ3: 環境変数を更新

`.env`ファイルを編集：

```env
# Stripe (テストモード)
STRIPE_SECRET_KEY="sk_test_51QdVLyP3pqF8K9K9..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_51QdVLyP3pqF8K9K9..."
```

### ステップ4: 開発サーバーを再起動

```bash
# 現在のサーバーを停止（Ctrl+C）
# 再起動
npm run dev
```

### ステップ5: テスト

1. 予約を作成
2. 決済ページで以下のテストカードを使用：

**成功するカード:**
```
カード番号: 4242 4242 4242 4242
有効期限: 任意の未来の日付
CVC: 任意の3桁
```

**その他のテストカード:**
```
カード拒否: 4000 0000 0000 0002
残高不足: 4000 0000 0000 9995
3Dセキュア: 4000 0025 0000 3155
```

---

## 🔔 Webhook設定（本番環境）

### 開発環境でのWebhookテスト

```bash
# Stripe CLIをインストール
# macOS
brew install stripe/stripe-cli/stripe

# Windows
scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
scoop install stripe

# ログイン
stripe login

# Webhookをリッスン
stripe listen --forward-to localhost:3000/api/payments/webhook
```

表示されたwebhook署名シークレットを`.env`に追加：
```env
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### 本番環境でのWebhook設定

1. Stripeダッシュボード → 開発者 → Webhook
2. 「エンドポイントを追加」をクリック
3. エンドポイントURL: `https://your-domain.com/api/payments/webhook`
4. リッスンするイベント: `payment_intent.succeeded`を選択
5. 署名シークレットをコピーして環境変数に設定

---

## 💰 本番環境への移行

### 1. 本番モードに切り替え

Stripeダッシュボードで「本番モード」に切り替え

### 2. 本番APIキーを取得

開発者 → APIキー → 本番モードのキーをコピー

### 3. 環境変数を更新

```env
# Stripe (本番モード)
STRIPE_SECRET_KEY="sk_live_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### 4. ビジネス情報を登録

Stripeダッシュボードで以下を設定：
- 会社情報
- 銀行口座情報
- 本人確認書類

---

## 🎨 決済フロー

### モックモード
```
予約作成 → 決済ページ → テストカード入力 → 
モック処理（2秒） → 予約確定 → 成功ページ
```

### 本番モード
```
予約作成 → 決済ページ → カード情報入力 → 
Stripe処理 → Webhook受信 → 予約確定 → 成功ページ
```

---

## 🔍 トラブルシューティング

### モックモードから切り替わらない

**原因:** 環境変数が正しく設定されていない

**解決方法:**
1. `.env`ファイルを確認
2. APIキーが`your_stripe`や`test_key_replace`を含んでいないか確認
3. 開発サーバーを再起動

### Webhook検証エラー

**原因:** Webhook署名シークレットが正しくない

**解決方法:**
1. Stripeダッシュボードで署名シークレットを確認
2. `.env`の`STRIPE_WEBHOOK_SECRET`を更新
3. 開発サーバーを再起動

### 決済が失敗する

**原因:** テストカード番号が正しくない

**解決方法:**
- テストモード: `4242 4242 4242 4242`を使用
- 本番モード: 実際のクレジットカードを使用

---

## 📊 決済データの確認

### Prisma Studio

```bash
npm run db:studio
```

ブラウザで http://localhost:5555 が開き、以下を確認できます：
- Reservation（予約）
- Payment（決済）
- User（ユーザー）

### Stripeダッシュボード

https://dashboard.stripe.com で以下を確認：
- 決済履歴
- 顧客情報
- Webhook履歴

---

## 🎉 まとめ

### 現在の状態
✅ モックモードで完全に動作  
✅ テストカードで決済テスト可能  
✅ 予約確定まで完全に機能

### 本番環境への移行
1. Stripeアカウント作成
2. APIキー取得
3. 環境変数更新
4. Webhook設定
5. ビジネス情報登録

### テスト方法
```
http://localhost:3000/auth/signin
↓
サービス選択
↓
予約作成
↓
決済（テストカード: 4242 4242 4242 4242）
↓
成功！
```

**今すぐテストできます！** 🚀
