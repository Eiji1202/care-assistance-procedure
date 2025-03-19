import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { procedureManualSchema } from '@/lib/schemas/procedureManuals';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {

    const id = await params.id;

    // 手順書の存在確認
    const existingManual = await prisma.procedureManual.findUnique({
      where: { id },
    });

    if (!existingManual) {
      return NextResponse.json(
        { success: false, error: '手順書が見つかりません' },
        { status: 404 }
      );
    }

    // リクエストボディを解析
    const body = await request.json();

    // バリデーション
    const validation = procedureManualSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors },
        { status: 400 }
      );
    }

    // 手順書を更新
    const updatedManual = await prisma.procedureManual.update({
      where: { id },
      data: {
        title: body.title,
        steps: body.steps,
      },
    });

    return NextResponse.json({ success: true, data: updatedManual });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('手順書の更新中にエラーが発生しました:', error);
    return NextResponse.json(
      { success: false, error: '手順書の更新に失敗しました' },
      { status: 500 }
    );
  }
}
