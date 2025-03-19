import EditProcedureManualForm from '@/components/EditProcedureManualForm';
import Title from '@/components/Title';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function EditProcedureManualPage({
  params,
}: {
  params: { facilityId: string; customerId: string; procedureManualId: string };
}) {
  // 既存の手順書データを取得
  const procedureManual = await prisma.procedureManual.findUnique({
    where: { id: params.procedureManualId },
  });

  if (!procedureManual) {
    notFound();
  }

  const serializedProcedureManual = JSON.parse(JSON.stringify(procedureManual));

  return (
    <div className="pt-16 container mx-auto flex flex-col items-center gap-10 max-w-[860px]">
      <Title>手順書を編集</Title>
      {/* クライアントコンポーネントとしてフォームをインポート */}
      <EditProcedureManualForm
        procedureManual={serializedProcedureManual}
        facilityId={params.facilityId}
        customerId={params.customerId}
      />
    </div>
  );
}
