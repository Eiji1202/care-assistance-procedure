'use server';

import prisma from '@/lib/prisma';

// 手順書の削除
export async function deleteProcedureManual(procedureManualId: string) {
  try {
    // 手順書の存在チェック
    const procedureManual = await prisma.procedureManual.findUnique({
      where: { id: procedureManualId },
    });

    if (!procedureManual) {
      return { success: false, error: '手順書が見つかりません' };
    }

    // 手順書を削除
    await prisma.procedureManual.delete({
      where: { id: procedureManualId },
    });

    return { success: true };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('手順書削除エラー:', error);
    return { success: false, error: '手順書の削除中にエラーが発生しました' };
  }
}
