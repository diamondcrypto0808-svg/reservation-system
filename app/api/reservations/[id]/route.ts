import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { status } = body;

    const reservation = await prisma.reservation.findUnique({
      where: { id: params.id },
    });

    if (!reservation) {
      return NextResponse.json(
        { error: "予約が見つかりません" },
        { status: 404 }
      );
    }

    if (session.user.role !== 'ADMIN' && reservation.userId !== session.user.id) {
      return NextResponse.json(
        { error: "権限がありません" },
        { status: 403 }
      );
    }

    const updatedReservation = await prisma.reservation.update({
      where: { id: params.id },
      data: { status },
      include: {
        service: true,
        payment: true,
      },
    });

    return NextResponse.json(updatedReservation);
  } catch (error) {
    return NextResponse.json(
      { error: "予約の更新に失敗しました" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      );
    }

    const reservation = await prisma.reservation.findUnique({
      where: { id: params.id },
    });

    if (!reservation) {
      return NextResponse.json(
        { error: "予約が見つかりません" },
        { status: 404 }
      );
    }

    if (session.user.role !== 'ADMIN' && reservation.userId !== session.user.id) {
      return NextResponse.json(
        { error: "権限がありません" },
        { status: 403 }
      );
    }

    await prisma.reservation.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "予約をキャンセルしました" });
  } catch (error) {
    return NextResponse.json(
      { error: "予約のキャンセルに失敗しました" },
      { status: 500 }
    );
  }
}
