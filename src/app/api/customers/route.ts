import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// 利用者の作成
export async function POST(request: NextRequest) {
  try {
    const { name, gender, handicap, age, facilityId } = await request.json();

    // 利用者をデータベースに作成
    const customer = await prisma.customer.create({
      data: {
        name,
        gender,
        handicap,
        age: Number(age),
        facilityId,
      },
    });

    // 作成した利用者データを返す
    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('利用者の登録中にエラーが発生しました:', error);
    return NextResponse.json(
      { error: '利用者の登録に失敗しました' },
      { status: 500 }
    );
  }
}
