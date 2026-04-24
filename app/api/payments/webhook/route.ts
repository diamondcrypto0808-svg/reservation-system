import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { sendReservationConfirmation } from "@/lib/email";
import { headers } from "next/headers";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "署名がありません" },
      { status: 400 }
    );
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json(
      { error: "Webhook検証に失敗しました" },
      { status: 400 }
    );
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const reservationId = paymentIntent.metadata.reservationId;

    await prisma.payment.updateMany({
      where: { stripePaymentId: paymentIntent.id },
      data: {
        status: 'COMPLETED',
        paidAt: new Date(),
      },
    });

    await prisma.reservation.update({
      where: { id: reservationId },
      data: { status: 'CONFIRMED' },
    });

    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: {
        user: true,
        service: true,
      },
    });

    if (reservation) {
      await sendReservationConfirmation(
        reservation.user.email,
        {
          serviceName: reservation.service.name,
          date: format(new Date(reservation.date), 'yyyy年MM月dd日', { locale: ja }),
          time: `${reservation.startTime} - ${reservation.endTime}`,
          amount: reservation.totalAmount,
        }
      );
    }
  }

  return NextResponse.json({ received: true });
}
