import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateReading, CARD_TYPES, type CardType } from '@/lib/llm';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { cardType, nickname } = body;

    if (!cardType || !CARD_TYPES.includes(cardType as CardType)) {
      return NextResponse.json(
        { error: '유효하지 않은 카드입니다.' },
        { status: 400 }
      );
    }

    if (nickname && (typeof nickname !== 'string' || nickname.length > 20)) {
      return NextResponse.json(
        { error: '닉네임은 20자 이내로 입력해주세요.' },
        { status: 400 }
      );
    }

    const room = await prisma.room.findUnique({
      where: { id },
      include: { cards: true },
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

    // Check if card type already picked
    if (room.cards.some(card => card.cardType === cardType)) {
      return NextResponse.json(
        { error: '이미 선택된 카드입니다.' },
        { status: 409 }
      );
    }

    // Generate reading using LLM
    const readingContent = await generateReading(
      cardType as CardType,
      room.question,
      nickname || undefined
    );

    const reading = `${readingContent.hook}\n\n${readingContent.role}\n\n"${readingContent.caption}"`;

    const card = await prisma.card.create({
      data: {
        roomId: id,
        cardType,
        nickname: nickname?.trim() || null,
        reading,
      },
    });

    return NextResponse.json({
      id: card.id,
      cardType: card.cardType,
      nickname: card.nickname,
      reading: card.reading,
      createdAt: card.createdAt.toISOString(),
    });
  } catch (error) {
    console.error('Error creating card:', error);
    return NextResponse.json(
      { error: '카드 선택 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
