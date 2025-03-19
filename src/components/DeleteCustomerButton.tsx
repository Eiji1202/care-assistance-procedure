'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Trash2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Loader from './Loader';
import { deleteCustomer } from '@/lib/actions/customerActions';

type Props = {
  customerId: string;
  customerName: string;
};

export default function DeleteCustomerButton(props: Props) {
  const { customerId, customerName } = props;
  const [isOpen, setIsOpen] = useState(false);
  const { pending } = useFormStatus();
  const router = useRouter();

  // Server Actionを呼び出す処理
  const handleFormAction = async () => {
    try {
      const result = await deleteCustomer(customerId);
      if (result.success) {
        toast.success(`『${customerName}』様を削除しました`);
        setIsOpen(false);
        router.refresh();
      } else {
        throw new Error(result.error || '利用者の削除に失敗しました');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('利用者の削除中にエラーが発生しました:', error);
      toast.error('利用者の削除に失敗しました。もう一度お試しください');
    }
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="hover:bg-transparent hover:text-muted-foreground"
              onClick={() => setIsOpen(true)}
            >
              <Trash2 />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>『{customerName}』様を削除します</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>利用者を削除</DialogTitle>
            <DialogDescription>
              『{customerName}』様を削除しますか？
              <br />
              <span className="text-destructive-foreground">
                ※こちらの利用者の手順書のデータも全て削除されます。
              </span>
            </DialogDescription>
          </DialogHeader>
          <form action={handleFormAction}>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={pending}
              >
                キャンセル
              </Button>
              <Button
                variant="destructive"
                disabled={pending}
              >
                {pending ? <Loader /> : <span>削除する</span>}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
