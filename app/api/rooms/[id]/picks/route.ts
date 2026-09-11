import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCardByKey } from '@/lib/cards';
import { generateTextWithHF } from '@/lib/textgen';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { cardKey, nickname } = body;

    if (!cardKey || typeof cardKey !== 'string') {
      return NextResponse.json(
        { error: 'Card key is required' },
        { status: 400 }
      );
    }

    // Validate card exists
    const card = getCardByKey(cardKey);
    if (!card) {
      return NextResponse.json(
        { error: 'Invalid card key' },
        { status: 400 }
      );
    }

    const room = await prisma.room.findUnique({
      where: { id },
    });

    if (!room) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }

    // Check if room has expired
    if (room.expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'Room has expired' },
        { status: 410 }
      );
    }

    // Generate role line
    const roleLine = await generateTextWithHF(cardKey, room.question);

    const pick = await prisma.pick.create({
      data: {
        roomId: id,
        cardKey,
        roleLine,
        nickname: nickname || null,
      },
    });

    return NextResponse.json({
      id: pick.id,
      cardKey: pick.cardKey,
      roleLine: pick.roleLine,
      nickname: pick.nickname,
      createdAt: pick.createdAt,
    });
  } catch (error) {
    console.error('Error creating pick:', error);
    return NextResponse.json(
      { error: 'Failed to create pick' },
      { status: 500 }
    );
  }
}
