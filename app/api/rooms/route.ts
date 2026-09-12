import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { randomBytes } from 'crypto';
import { FIXED_ROOM_QUESTION } from '@/lib/copy';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { question } = body;

    // Enforce fixed question - reject if client attempts to override
    if (question && question !== FIXED_ROOM_QUESTION) {
      return NextResponse.json(
        { error: '잘못된 요청입니다.' },
        { status: 400 }
      );
    }

    // Always use the fixed question
    const finalQuestion = FIXED_ROOM_QUESTION;

    // Generate host token
    const hostToken = randomBytes(32).toString('hex');

    // Set expiry to 7 days from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const room = await prisma.room.create({
      data: {
        question: finalQuestion,
        hostToken,
        expiresAt,
      },
    });

    return NextResponse.json({
      id: room.id,
      question: room.question,
      hostToken: room.hostToken,
      expiresAt: room.expiresAt.toISOString(),
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : '';
    console.error('Error creating room:', {
      message: errorMessage,
      stack: errorStack,
      error
    });
    return NextResponse.json(
      { error: '방 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
