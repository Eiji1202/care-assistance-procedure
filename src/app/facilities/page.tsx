import AddFacilityButton from '@/components/AddFacilityButton';
import DeleteFacilityButton from '@/components/DeleteFacilityButton';
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
import Link from 'next/link';

export default async function Page() {
  const facilities = await prisma.facility.findMany();

  return (
    <div className="pt-16 container mx-auto flex flex-col items-center gap-10 max-w-[860px] ">
      <Title>運営施設一覧</Title>
      <AddFacilityButton />
      <div className="w-full border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>施設名</TableHead>
              <TableHead>都道府県</TableHead>
              <TableHead>市区町村</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {facilities.length >= 1 ? (
              facilities.map((facility) => (
                <TableRow
                  key={facility.id}
                  className="hover:bg-gray-100 transition-colors duration-200"
                >
                  <TableCell>
                    <Link
                      href={`/facilities/${facility.id}/customers/`}
                      className="flex items-center gap-2 hover:underline underline-offset-4"
                    >
                      {facility.name}
                    </Link>
                  </TableCell>
                  <TableCell>{facility.prefecture}</TableCell>
                  <TableCell>{facility.prefecture}</TableCell>
                  <TableCell>
                    <DeleteFacilityButton
                      facilityId={facility.id}
                      facilityName={facility.name}
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
                    登録されてる施設がありません。
                    <br />
                    施設追加ボタンから登録してください。
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
