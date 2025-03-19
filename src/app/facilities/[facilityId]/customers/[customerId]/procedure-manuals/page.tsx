import AddProcedureManualButton from '@/components/AddProcedureManualButton';
import DeleteProcedureManualButton from '@/components/DeleteProcedureManualButton';
import Title from '@/components/Title';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import prisma from '@/lib/prisma';
import { formatDate } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function Page(props: {
  params: Promise<{ facilityId: string; customerId: string }>;
}) {
  const { facilityId, customerId } = await props.params;

  // 施設が存在するか確認
  const facility = await prisma.facility.findUnique({
    where: { id: facilityId },
  });

  if (!facility) {
    notFound();
  }

  // 利用者が存在するか確認
  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
  });

  if (!customer) {
    notFound();
  }

  // 施設に紐づく利用者を取得
  const procedureManuals = await prisma.procedureManual.findMany({
    where: { customerId },
  });

  return (
    <div className="pt-16 container mx-auto flex flex-col items-center gap-10 max-w-[860px]">
      <Link
        href={`/facilities/${facility.id}/customers`}
        className="self-start flex items-center gap-2 text-sm text-muted-foreground hover:underline underline-offset-4"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        利用者一覧に戻る
      </Link>
      <Title>{customer.name} 様の手順書一覧</Title>
      <AddProcedureManualButton />
      <div className="w-full border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>支援内容</TableHead>
              <TableHead>作成日</TableHead>
              <TableHead>最終更新日</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {procedureManuals.length >= 1 ? (
              procedureManuals.map((procedureManual) => (
                <TableRow
                  key={procedureManual.id}
                  className="hover:bg-gray-100 transition-colors duration-200"
                >
                  <TableCell>
                    <Link
                      href={`/facilities/${facility.id}/customers/${customer.id}/procedure-manuals/${procedureManual.id}`}
                      className="flex items-center gap-2 hover:underline underline-offset-4"
                    >
                      {procedureManual.title}
                    </Link>
                  </TableCell>
                  <TableCell>{formatDate(procedureManual.createdAt)}</TableCell>
                  <TableCell>{formatDate(procedureManual.updatedAt)}</TableCell>
                  <TableCell>
                    <DeleteProcedureManualButton
                      procedureManualId={procedureManual.id}
                      procedureManualName={procedureManual.title}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 text-center"
                >
                  <p className="text-muted-foreground">
                    登録されてる手順書がありません。
                    <br />
                    手順書追加ボタンから登録してください。
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
