import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateImages() {
  console.log('🎨 サービス画像を日本のテーマに更新中...');

  const imageUpdates = [
    {
      name: 'ヘアカット',
      image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&h=600&fit=crop',
    },
    {
      name: 'カラーリング',
      image: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=800&h=600&fit=crop',
    },
    {
      name: 'パーマ',
      image: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800&h=600&fit=crop',
    },
    {
      name: 'トリートメント',
      image: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=800&h=600&fit=crop',
    },
    {
      name: 'ヘッドスパ',
      image: 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=800&h=600&fit=crop',
    },
    {
      name: 'セット・ブロー',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=600&fit=crop',
    },
  ];

  for (const update of imageUpdates) {
    try {
      const result = await prisma.service.updateMany({
        where: { name: update.name },
        data: { image: update.image },
      });

      if (result.count > 0) {
        console.log(`✅ ${update.name}: 画像を更新しました`);
      } else {
        console.log(`⚠️  ${update.name}: サービスが見つかりませんでした`);
      }
    } catch (error) {
      console.error(`❌ ${update.name}: 更新に失敗しました`, error);
    }
  }

  console.log('🎉 画像の更新が完了しました！');
}

updateImages()
  .catch((e) => {
    console.error('エラー:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
