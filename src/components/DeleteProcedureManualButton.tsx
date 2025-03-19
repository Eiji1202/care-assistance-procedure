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
import { deleteProcedureManual } from '@/lib/actions/procedureManualActions';

type Props = {
  procedureManualId: string;
  procedureManualName: string;
};

export default function DeleteProcedureManualButton(props: Props) {
  const { procedureManualId, procedureManualName } = props;
  const [isOpen, setIsOpen] = useState(false);
  const { pending } = useFormStatus();
  const router = useRouter();

  // Server Actionを呼び出す処理
  const handleFormAction = async () => {
    try {
      const result = await deleteProcedureManual(procedureManualId);
      if (result.success) {
        toast.success(`『${procedureManualName}』を削除しました`);
        setIsOpen(false);
        router.refresh();
      } else {
        throw new Error(result.error || '手順書の削除に失敗しました');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('手順書の削除中にエラーが発生しました:', error);
      toast.error('手順書の削除に失敗しました。もう一度お試しください');
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
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>『{procedureManualName}』を削除します</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>手順書を削除</DialogTitle>
            <DialogDescription>
              『{procedureManualName}』を削除しますか？
              <br />
              <span className="text-destructive-foreground">
                ※この操作は元に戻せません。
              </span>
            </DialogDescription>
          </DialogHeader>
          <form action={handleFormAction}>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={pending}
                type="button"
              >
                キャンセル
              </Button>
              <Button
                variant="destructive"
                disabled={pending}
                type="submit"
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
