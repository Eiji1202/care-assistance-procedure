import { z } from 'zod';

// ステップのスキーマ定義
export const stepSchema = z.object({
  stepTitle: z.string().trim().min(1, 'タイトルを入力してください'),
  description: z.string().trim().min(1, '説明を入力してください'),
  imageUrl: z.string().optional(),
});

// フォーム全体のスキーマ
export const procedureManualSchema = z.object({
  title: z.string().trim().min(1, '手順書のタイトルを入力してください'),
  steps: z.array(stepSchema).min(1, '少なくとも1つの手順を追加してください'),
});

// 型定義のエクスポート
// export type StepFormValues = z.infer<typeof stepSchema>;
export type ProcedureManualFormValues = z.infer<typeof procedureManualSchema>;
