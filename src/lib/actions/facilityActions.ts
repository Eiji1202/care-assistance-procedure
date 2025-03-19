'use server';

import prisma from '@/lib/prisma';

// 施設の削除
export async function deleteFacility(facilityId: string) {
  try {
    // 施設の存在チェック
    const facility = await prisma.facility.findUnique({
      where: { id: facilityId },
    });

    if (!facility) {
      return { success: false, error: '施設が見つかりません' };
    }

    // 施設を削除（関連する利用者と手順書も削除される）
    await prisma.facility.delete({
      where: { id: facilityId },
    });

    return { success: true };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('施設削除エラー:', error);
    return { success: false, error: '施設の削除中にエラーが発生しました' };
  }
}
