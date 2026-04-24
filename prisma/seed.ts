import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // 管理者ユーザーの作成
  const hashedPassword = await bcrypt.hash('kubo123456', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'kubo@gmail.com' },
    update: {
      password: hashedPassword,
      name: '管理者',
      role: 'ADMIN',
    },
    create: {
      email: 'kubo@gmail.com',
      name: '管理者',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('管理者ユーザーを作成しました:', admin);

  // サンプルサービスの作成
  const services = [
    {
      name: 'ヘアカット',
      description: 'プロのスタイリストによるカット。お客様のご要望に合わせたスタイルをご提案します。',
      price: 5000,
      duration: 60,
      image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&h=600&fit=crop',
    },
    {
      name: 'カラーリング',
      description: '最新のカラー技術で理想の髪色を実現。ダメージを最小限に抑えた施術を行います。',
      price: 8000,
      duration: 90,
      image: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=800&h=600&fit=crop',
    },
    {
      name: 'パーマ',
      description: '自然なウェーブから華やかなカールまで、お好みのスタイルをお作りします。',
      price: 10000,
      duration: 120,
      image: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800&h=600&fit=crop',
    },
    {
      name: 'トリートメント',
      description: '髪の内部から補修する集中トリートメント。艶やかで健康的な髪へ導きます。',
      price: 3000,
      duration: 30,
      image: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=800&h=600&fit=crop',
    },
    {
      name: 'ヘッドスパ',
      description: '頭皮マッサージとトリートメントで心身ともにリラックス。血行促進効果も期待できます。',
      price: 4000,
      duration: 45,
      image: 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=800&h=600&fit=crop',
    },
    {
      name: 'セット・ブロー',
      description: '特別な日のためのヘアセット。結婚式やパーティーなどにおすすめです。',
      price: 6000,
      duration: 60,
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=600&fit=crop',
    },
  ];

  for (const service of services) {
    const existing = await prisma.service.findFirst({
      where: { name: service.name },
    });

    if (!existing) {
      await prisma.service.create({
        data: service,
      });
    }
  }

  console.log('サンプルサービスを作成しました');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
