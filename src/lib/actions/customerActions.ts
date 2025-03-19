'use server';

import prisma from '@/lib/prisma';

// 利用者の削除
export async function deleteCustomer(customerId: string) {
  try {
    // 利用者の存在チェック
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      return { success: false, error: '利用者が見つかりません' };
    }

    // 利用者を削除（関連する手順書も削除される）
    await prisma.customer.delete({
      where: { id: customerId },
    });

    return { success: true };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('利用者削除エラー:', error);
    return { success: false, error: '利用者の削除中にエラーが発生しました' };
  }
}
