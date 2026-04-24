import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json(
      { error: "サービスの取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: "権限がありません" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, description, price, duration, image } = body;

    const service = await prisma.service.create({
      data: {
        name,
        description,
        price: parseInt(price),
        duration: parseInt(duration),
        image,
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "サービスの作成に失敗しました" },
      { status: 500 }
    );
  }
}
