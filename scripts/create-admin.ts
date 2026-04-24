import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  const email = process.argv[2];
  const password = process.argv[3];
  const name = process.argv[4] || '管理者';

  if (!email || !password) {
    console.error('使用方法: ts-node scripts/create-admin.ts <email> <password> [name]');
    console.error('例: ts-node scripts/create-admin.ts kubo@gmail.com kubo123456 "管理者"');
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const admin = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    console.log('管理者ユーザーを作成しました:');
    console.log('メール:', admin.email);
    console.log('名前:', admin.name);
    console.log('役割:', admin.role);
  } catch (error) {
    console.error('エラー:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
