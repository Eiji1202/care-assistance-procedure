import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Title from '@/components/Title';
import Image from 'next/image';
import { formatDateTime } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import QRCodeButton from '@/components/QRCodeButton';
import { ScrollArea } from '@/components/ui/scroll-area';

export default async function ProcedureManualDetailPage({
  params,
}: {
  params: { facilityId: string; customerId: string; procedureManualId: string };
}) {
  // 施設が存在するか確認
  const facility = await prisma.facility.findUnique({
    where: { id: params.facilityId },
  });

  if (!facility) {
    notFound();
  }

  // 利用者が存在するか確認
  const customer = await prisma.customer.findUnique({
    where: { id: params.customerId },
  });

  if (!customer) {
    notFound();
  }

  // 手順書を取得
  const procedureManual = await prisma.procedureManual.findUnique({
    where: { id: params.procedureManualId },
  });

  if (!procedureManual) {
    notFound();
  }

  // stepsはJSON型なので、TypeScriptで型を付ける
  type StepType = {
    stepTitle: string;
    description: string;
    imageUrl?: string;
  };

  const steps = procedureManual.steps as StepType[];

  const procedureManualUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/facilities/${facility.id}/customers/${customer.id}/procedure-manuals/${procedureManual.id}`;

  return (
    <div className="pt-16 container mx-auto flex flex-col gap-10 max-w-[860px]">
      <div className="flex items-center justify-between">
        <Link
          href={`/facilities/${facility.id}/customers/${customer.id}/procedure-manuals`}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:underline underline-offset-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          手順書一覧に戻る
        </Link>
        <QRCodeButton url={procedureManualUrl} />
        <Link
          href={`/facilities/${facility.id}/customers/${customer.id}/procedure-manuals/${procedureManual.id}/edit`}
        >
          <Button>編集</Button>
        </Link>
      </div>
      <div>
        <Title>{procedureManual.title}</Title>
        <div className="flex flex-col gap-1 text-sm text-muted-foreground mt-4">
          <p>作成日: {formatDateTime(procedureManual.createdAt)}</p>
          <p>最終更新日: {formatDateTime(procedureManual.updatedAt)}</p>
        </div>
      </div>
      {/* 手順のステップ表示 */}
      <ScrollArea className="h-[60vh] [&_[data-slot=scroll-area-scrollbar]]:hidden">
        <div className="space-y-8 relative">
          {/* 接続線 */}
          <div className="absolute left-5 top-10 bottom-1 w-0.5 bg-gray-200 z-0"></div>

          {steps.map((step, index) => (
            <div
              key={index}
              className="relative z-10"
            >
              {/* ステップ番号のバッジ */}
              <div className="absolute left-0 w-10 h-10 rounded-full bg-gray-200 border border-primary flex items-center justify-center font-bold text-primary">
                {index + 1}
              </div>

              {/* ステップのコンテンツ */}
              <div className="ml-14 p-6 border rounded-md bg-white">
                <h3 className="text-lg font-bold mb-2">{step.stepTitle}</h3>
                <div
                  className={`${step.imageUrl ? 'mb-4' : 'mb-2'} whitespace-pre-wrap text-gray-700`}
                >
                  {step.description}
                </div>

                {/* 画像があれば表示 */}
                {step.imageUrl && (
                  <div className="relative h-64 w-full">
                    <Image
                      src={step.imageUrl}
                      alt={`手順 ${index + 1} の画像`}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
