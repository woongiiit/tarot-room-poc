import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; cardId: string }> }
) {
  try {
    const { id, cardId } = await params;
    const hostToken = request.headers.get('x-host-token');

    if (!hostToken) {
      return NextResponse.json(
        { error: '권한이 없습니다.' },
        { status: 401 }
      );
    }

    const room = await prisma.room.findUnique({
      where: { id },
    });

    if (!room) {
      return NextResponse.json(
        { error: '방을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    if (room.hostToken !== hostToken) {
      return NextResponse.json(
        { error: '권한이 없습니다.' },
        { status: 403 }
      );
    }

    const card = await prisma.card.findUnique({
      where: { id: cardId, roomId: id },
    });

    if (!card) {
      return NextResponse.json(
        { error: '카드를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const updatedCard = await prisma.card.update({
      where: { id: cardId },
      data: { isHidden: true },
    });

    return NextResponse.json({
      id: updatedCard.id,
      isHidden: updatedCard.isHidden,
    });
  } catch (error) {
    console.error('Error hiding card:', error);
    return NextResponse.json(
      { error: '카드 숨기기 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
