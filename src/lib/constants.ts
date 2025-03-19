import { Gender } from '@prisma/client';

export const genderLabels: Record<Gender, string> = {
  MALE: '男性',
  FEMALE: '女性',
  OTHER: 'その他',
};
