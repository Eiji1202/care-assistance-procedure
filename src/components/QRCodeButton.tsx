'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { QRCodeSVG } from 'qrcode.react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { QrCode } from 'lucide-react';

type Props = {
  url: string;
};

export default function QRCodeButton(props: Props) {
  const { url } = props;
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <QrCode />
          <span>QRコードを表示</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>手順書QRコード</DialogTitle>
          <DialogDescription>
            このQRコードをスキャンすると、スマートフォンでこの手順書を閲覧できます
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center py-6">
          <QRCodeSVG
            id="qr-code"
            value={url}
            size={200}
            level="H"
          />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
          >
            閉じる
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
