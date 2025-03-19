import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { title, steps, customerId } = await request.json();

    // カスタマーの存在チェック
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      return NextResponse.json(
        { error: '指定された利用者が見つかりません' },
        { status: 404 }
      );
    }

    // 手順書をデータベースに作成
    const procedureManual = await prisma.procedureManual.create({
      data: {
        title,
        steps, // JSON型のフィールドにそのまま格納
        customer: {
          connect: { id: customerId }
        },
      },
    });

    // 作成した手順書データを返す
    return NextResponse.json(procedureManual, { status: 201 });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('手順書の登録中にエラーが発生しました:', error);
    return NextResponse.json(
      { error: '手順書の登録に失敗しました' },
      { status: 500 }
    );
  }
}
