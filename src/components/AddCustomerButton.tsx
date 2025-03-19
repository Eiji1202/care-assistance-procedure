'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

const formSchema = z.object({
  name: z
    .string()
    .transform((val) => {
      return val.replace(/\s+/g, '');
    })
    .refine((val) => val.length >= 1, {
      message: '氏名を入力してください',
    }),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER'], {
    required_error: '性別を選択してください',
  }),
  age: z.coerce
    .number()
    .int()
    .min(0, '年齢は0以上で入力してください')
    .max(150, '年齢は150以下で入力してください')
    .optional()
    .refine((val) => val !== undefined, '年齢を入力してください'),
  handicap: z.string().trim().min(1, '障害名を入力してください'),
});

type FormValues = z.infer<typeof formSchema>;

export default function AddCustomerButton() {
  const [isOpen, setIsOpen] = useState(false);
  const params = useParams();
  const facilityId = params.facilityId as string;
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      gender: undefined,
      handicap: '',
      age: undefined,
    },
    mode: 'onSubmit',
  });

  // 利用者登録
  async function onSubmit(data: FormValues) {
    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          facilityId,
        }),
      });

      if (!response.ok) {
        throw new Error('利用者の登録に失敗しました');
      }

      toast.success(`『${data.name}』様を登録しました`);
      setIsOpen(false);
      form.reset();
      router.refresh();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('利用者の登録中にエラーが発生しました:', error);
      toast.error('利用者の登録に失敗しました。もう一度お試しください');
    }
  }

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
          利用者を追加
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">利用者を登録</DialogTitle>
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
                    氏名
                    <span className="text-destructive-foreground">*</span>
                    <span className="text-xs">※様は不要</span>
                  </Label>
                  <FormControl>
                    <Input
                      placeholder="氏名を入力してください"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <Label>
                    性別<span className="text-destructive-foreground">*</span>
                  </Label>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="性別を選択してください" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="MALE">男性</SelectItem>
                      <SelectItem value="FEMALE">女性</SelectItem>
                      <SelectItem value="OTHER">その他</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="handicap"
              render={({ field }) => (
                <FormItem>
                  <Label>
                    障害名<span className="text-destructive-foreground">*</span>
                  </Label>
                  <FormControl>
                    <Input
                      placeholder="障害名を入力してください（例：自閉症）"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <Label>
                    年齢<span className="text-destructive-foreground">*</span>
                  </Label>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="年齢を入力してください"
                      value={field.value === undefined ? '' : field.value}
                      onChange={(e) => {
                        const value =
                          e.target.value === ''
                            ? undefined
                            : parseInt(e.target.value, 10);
                        field.onChange(value);
                      }}
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
