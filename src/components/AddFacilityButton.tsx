'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { IoMdAdd } from 'react-icons/io';
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { toast } from 'sonner';
import { Label } from './ui/label';

const formSchema = z.object({
  name: z
    .string({
      required_error: '施設名を入力してください',
    })
    .trim()
    .min(1, '施設名を入力してください'),
  prefecture: z
    .string({
      required_error: '都道府県を入力してください',
    })
    .trim()
    .min(1, '都道府県を入力してください')
    .refine((val) => /[都道府県]$/.test(val), {
      message: '「都・道・府・県」のいずれかで終わる必要があります',
    }),
  city: z
    .string({
      required_error: '市区町村を入力してください',
    })
    .trim()
    .min(1, '市区町村を入力してください')
    .refine((val) => /[市区町村]$/.test(val), {
      message: '「市・区・町・村」のいずれかで終わる必要があります',
    }),
});

type FormValues = z.infer<typeof formSchema>;

export default function AddFacilityButton() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      prefecture: '',
      city: '',
    },
  });

  const handleOpenChange = (open: boolean) => {
    if (!open && form.formState.isDirty) {
      const confirmClose = window.confirm(
        '変更内容が保存されていません。閉じてもよろしいですか？'
      );

      if (confirmClose) {
        setIsOpen(false);
        form.reset();
      }
    } else {
      setIsOpen(open);

      if (!open) {
        form.reset();
      }
    }
  };

  // 施設登録
  async function onSubmit(data: FormValues) {
    try {
      const response = await fetch('/api/facilities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('施設の登録に失敗しました');
      }

      toast.success(`『${data.name}』を登録しました`);
      setIsOpen(false);
      form.reset();
      router.refresh();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('施設の追加中にエラーが発生しました:', error);
      toast.error('施設の追加に失敗しました。もう一度お試しください');
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={handleOpenChange}
    >
      <DialogTrigger asChild>
        <Button
          size="lg"
          variant="outline"
          className="flex items-center gap-1"
        >
          <IoMdAdd className="h-5 w-5" />
          施設を追加
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">施設を登録</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <Label>
                    施設名
                    <span className="text-destructive-foreground">*</span>
                  </Label>
                  <FormControl>
                    <Input
                      placeholder="施設名を入力してください"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="prefecture"
              render={({ field }) => (
                <FormItem>
                  <Label>
                    都道府県
                    <span className="text-destructive-foreground">*</span>
                  </Label>
                  <FormControl>
                    <Input
                      placeholder="例：岐阜県"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <Label>
                    市区町村
                    <span className="text-destructive-foreground">*</span>
                  </Label>
                  <FormControl>
                    <Input
                      placeholder="例：岐阜市"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => handleOpenChange(false)}
              >
                キャンセル
              </Button>
              <Button type="submit">登録する</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
