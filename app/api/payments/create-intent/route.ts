import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { STRIPE_CONFIG, generateMockPaymentIntentId, generateMockClientSecret } from "@/lib/stripe-config";

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
      include: { service: true },
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

    // モックモードの場合
    if (STRIPE_CONFIG.isMockMode()) {
      console.log('🧪 Stripe Mock Mode: Payment Intent作成（テストモード）');
      
      const mockPaymentIntentId = generateMockPaymentIntentId();
      const mockClientSecret = generateMockClientSecret();

      await prisma.reservation.update({
        where: { id: reservationId },
        data: { paymentIntentId: mockPaymentIntentId },
      });

      // 既存のPaymentレコードを確認
      const existingPayment = await prisma.payment.findUnique({
        where: { reservationId: reservation.id },
      });

      if (!existingPayment) {
        await prisma.payment.create({
          data: {
            reservationId: reservation.id,
            amount: reservation.totalAmount,
            stripePaymentId: mockPaymentIntentId,
            status: 'PENDING',
          },
        });
      }

      return NextResponse.json({
        clientSecret: mockClientSecret,
        mockMode: true,
      });
    }

    // 実際のStripe処理
    const paymentIntent = await stripe.paymentIntents.create({
      amount: reservation.totalAmount,
      currency: 'jpy',
      metadata: {
        reservationId: reservation.id,
        userId: session.user.id,
      },
    });

    await prisma.reservation.update({
      where: { id: reservationId },
      data: { paymentIntentId: paymentIntent.id },
    });

    // 既存のPaymentレコードを確認
    const existingPayment = await prisma.payment.findUnique({
      where: { reservationId: reservation.id },
    });

    if (!existingPayment) {
      await prisma.payment.create({
        data: {
          reservationId: reservation.id,
          amount: reservation.totalAmount,
          stripePaymentId: paymentIntent.id,
          status: 'PENDING',
        },
      });
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      mockMode: false,
    });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    return NextResponse.json(
      { error: "決済の準備に失敗しました" },
      { status: 500 }
    );
  }
}
