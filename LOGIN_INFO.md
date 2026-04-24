# 🔐 ログイン情報

## 管理者アカウント

データベースセットアップ後に使用できます。

### ログイン情報

```
メールアドレス: kubo@gmail.com
パスワード: kubo123456
```

### アクセス方法

1. ログインページにアクセス:
   ```
   http://localhost:3000/auth/signin
   ```

2. 上記のメールアドレスとパスワードを入力

3. 管理画面にアクセス:
   ```
   http://localhost:3000/admin
   ```

## データベースセットアップ

管理者アカウントを作成するには、以下のコマンドを実行してください：

```bash
# データベースマイグレーション
npx prisma migrate dev --name init

# サンプルデータ投入（管理者アカウント作成）
npm run db:seed
```

## セキュリティに関する注意

⚠️ **本番環境では必ず以下を変更してください：**

1. メールアドレスを実際の管理者メールに変更
2. 強力なパスワードに変更
3. 環境変数で管理することを推奨

### パスワード変更方法

データベースセットアップ後、Prisma Studioで変更できます：

```bash
npm run db:studio
```

または、新しい管理者を作成：

```bash
ts-node scripts/create-admin.ts your-email@example.com your-secure-password "管理者名"
```

---

**現在のログイン情報:**
- メール: `kubo@gmail.com`
- パスワード: `kubo123456`
