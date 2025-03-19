import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// 施設の作成
export async function POST(request: NextRequest) {
  try {
    const { name, prefecture, city } = await request.json();

    // 施設をデータベースに作成
    const facility = await prisma.facility.create({
      data: {
        name,
        prefecture,
        city,
      },
    });

    // 作成した施設データを返す
    return NextResponse.json(facility, { status: 201 });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('施設の登録中にエラーが発生しました:', error);
    return NextResponse.json(
      { error: '施設の登録に失敗しました' },
      { status: 500 }
    );
  }
}
