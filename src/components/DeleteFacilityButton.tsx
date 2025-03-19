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
import { deleteFacility } from '@/lib/actions/facilityActions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Loader from './Loader';

type Props = {
  facilityId: string;
  facilityName: string;
};

export default function DeleteFacilityButton(props: Props) {
  const { facilityId, facilityName } = props;
  const [isOpen, setIsOpen] = useState(false);
  const { pending } = useFormStatus();
  const router = useRouter();

  // Server Actionを呼び出す処理
  const handleFormAction = async () => {
    try {
      const result = await deleteFacility(facilityId);
      if (result.success) {
        toast.success(`『${facilityName}』を削除しました`);
        setIsOpen(false);
        router.refresh();
      } else {
        throw new Error(result.error || '施設の削除に失敗しました');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('施設の削除中にエラーが発生しました:', error);
      toast.error('施設の削除に失敗しました。もう一度お試しください');
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
            <p>『{facilityName}』を削除します</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>施設を削除</DialogTitle>
            <DialogDescription>
              『{facilityName}』を削除しますか？
              <br />
              <span className="text-destructive-foreground">
                ※こちらの施設に所属する利用者と手順書のデータも全て削除されます。
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
