import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const room = await prisma.room.findUnique({
      where: { id },
      include: {
        cards: {
          where: { isHidden: false },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!room) {
      return NextResponse.json(
        { error: '방을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // Check if room is expired
    if (new Date() > room.expiresAt) {
      return NextResponse.json(
        { error: '만료된 방입니다.' },
        { status: 410 }
      );
    }

    return NextResponse.json({
      id: room.id,
      question: room.question,
      expiresAt: room.expiresAt.toISOString(),
      cards: room.cards.map(card => ({
        id: card.id,
        cardType: card.cardType,
        nickname: card.nickname,
        reading: card.reading,
        createdAt: card.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Error fetching room:', error);
    return NextResponse.json(
      { error: '방 정보를 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    await prisma.room.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting room:', error);
    return NextResponse.json(
      { error: '방 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
