import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const reservationSchema = z.object({
  serviceId: z.string(),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  notes: z.string().optional(),
});

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    let reservations;
    
    if (session.user.role === 'ADMIN') {
      reservations = await prisma.reservation.findMany({
        include: {
          user: { select: { name: true, email: true } },
          service: true,
          payment: true,
        },
        orderBy: { date: 'desc' },
      });
    } else {
      reservations = await prisma.reservation.findMany({
        where: { userId: session.user.id },
        include: {
          service: true,
          payment: true,
        },
        orderBy: { date: 'desc' },
      });
    }

    return NextResponse.json(reservations);
  } catch (error) {
    return NextResponse.json(
      { error: "予約の取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { serviceId, date, startTime, endTime, notes } = reservationSchema.parse(body);

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return NextResponse.json(
        { error: "サービスが見つかりません" },
        { status: 404 }
      );
    }

    const reservation = await prisma.reservation.create({
      data: {
        userId: session.user.id,
        serviceId,
        date: new Date(date),
        startTime,
        endTime,
        totalAmount: service.price,
        notes,
        status: 'PENDING',
      },
      include: {
        service: true,
      },
    });

    return NextResponse.json(reservation, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "予約の作成に失敗しました" },
      { status: 500 }
    );
  }
}
