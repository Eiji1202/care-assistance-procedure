import AddCustomerButton from '@/components/AddCustomerButton';
import DeleteCustomerButton from '@/components/DeleteCustomerButton';
import Title from '@/components/Title';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { genderLabels } from '@/lib/constants';
import prisma from '@/lib/prisma';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function Page(props: {
  params: Promise<{ facilityId: string }>;
}) {
  const { facilityId } = await props.params;

  // 施設が存在するか確認
  const facility = await prisma.facility.findUnique({
    where: { id: facilityId },
  });

  if (!facility) {
    notFound();
  }

  // 施設に紐づく利用者を取得
  const customers = await prisma.customer.findMany({
    where: { facilityId },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="pt-16 container mx-auto flex flex-col items-center gap-10 max-w-[860px]">
      <Link
        href={`/facilities`}
        className="self-start flex items-center gap-2 text-sm text-muted-foreground hover:underline underline-offset-4"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        施設一覧に戻る
      </Link>
      <Title>{facility.name}の利用者一覧</Title>
      <AddCustomerButton />
      <div className="w-full border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>氏名</TableHead>
              <TableHead>性別</TableHead>
              <TableHead>年齢</TableHead>
              <TableHead>障害名</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.length >= 1 ? (
              customers.map((customer) => (
                <TableRow
                  key={customer.id}
                  className="hover:bg-gray-100 transition-colors duration-200"
                >
                  <TableCell>
                    <Link
                      href={`/facilities/${facility.id}/customers/${customer.id}/procedure-manuals`}
                      className="flex items-center gap-2 hover:underline underline-offset-4"
                    >
                      {customer.name} 様
                    </Link>
                  </TableCell>
                  <TableCell>{genderLabels[customer.gender]}</TableCell>
                  <TableCell>
                    {customer.age ? `${customer.age}歳` : '-'}
                  </TableCell>
                  <TableCell>{customer.handicap}</TableCell>
                  <TableCell>
                    <DeleteCustomerButton
                      customerId={customer.id}
                      customerName={customer.name}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center"
                >
                  <p className="text-muted-foreground">
                    登録されてる利用者がいません。
                    <br />
                    利用者追加ボタンから登録してください。
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
