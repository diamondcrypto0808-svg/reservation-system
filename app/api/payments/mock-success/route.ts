import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendReservationConfirmation } from "@/lib/email";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      );
    }

    const { reservationId } = await request.json();

    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: {
        user: true,
        service: true,
      },
    });

    if (!reservation) {
      return NextResponse.json(
        { error: "予約が見つかりません" },
        { status: 404 }
      );
    }

    if (reservation.userId !== session.user.id) {
      return NextResponse.json(
        { error: "権限がありません" },
        { status: 403 }
      );
    }

    // 決済ステータスを更新
    await prisma.payment.updateMany({
      where: { reservationId: reservation.id },
      data: {
        status: 'COMPLETED',
        paidAt: new Date(),
      },
    });

    // 予約ステータスを確定に更新
    await prisma.reservation.update({
      where: { id: reservationId },
      data: { status: 'CONFIRMED' },
    });

    // 確認メール送信
    await sendReservationConfirmation(
      reservation.user.email,
      {
        serviceName: reservation.service.name,
        date: format(new Date(reservation.date), 'yyyy年MM月dd日', { locale: ja }),
        time: `${reservation.startTime} - ${reservation.endTime}`,
        amount: reservation.totalAmount,
      }
    );

    console.log('✅ Mock Payment Success:', {
      reservationId: reservation.id,
      amount: reservation.totalAmount,
      user: reservation.user.email,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Mock payment success error:', error);
    return NextResponse.json(
      { error: "決済処理に失敗しました" },
      { status: 500 }
    );
  }
}
