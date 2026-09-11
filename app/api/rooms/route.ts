import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { randomBytes } from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { question } = body;

    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return NextResponse.json(
        { error: '질문을 입력해주세요.' },
        { status: 400 }
      );
    }

    if (question.length > 200) {
      return NextResponse.json(
        { error: '질문은 200자 이내로 입력해주세요.' },
        { status: 400 }
      );
    }

    // Generate host token
    const hostToken = randomBytes(32).toString('hex');

    // Set expiry to 7 days from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const room = await prisma.room.create({
      data: {
        question: question.trim(),
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
    console.error('Error creating room:', error);
    return NextResponse.json(
      { error: '방 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
