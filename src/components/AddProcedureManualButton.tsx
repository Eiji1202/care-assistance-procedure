'use client';

import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
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
import { Label } from './ui/label';
import { toast } from 'sonner';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

// 共通スキーマのインポート
import {
  procedureManualSchema,
  ProcedureManualFormValues,
} from '@/lib/schemas/procedureManuals';

// コンポーネント化したSortableStepItemをインポート
import SortableStepItem from './SortableStepItem';

export default function AddProcedureManualButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<{
    [key: number]: File | null;
  }>({});
  const [previews, setPreviews] = useState<{ [key: number]: string }>({});
  const router = useRouter();
  const params = useParams();
  const facilityId = params.facilityId as string;
  const customerId = params.customerId as string;

  const form = useForm<ProcedureManualFormValues>({
    resolver: zodResolver(procedureManualSchema),
    defaultValues: {
      title: '',
      steps: [{ stepTitle: '', description: '', imageUrl: '' }],
    },
  });

  // 手順の追加・削除・移動
  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: 'steps',
  });

  const handleOpenChange = (open: boolean) => {
    if (
      !open &&
      (form.formState.isDirty || Object.keys(selectedFiles).length > 0)
    ) {
      const confirmClose = window.confirm(
        '変更内容が保存されていません。閉じてもよろしいですか？'
      );

      if (confirmClose) {
        setIsOpen(false);
        form.reset();
        setSelectedFiles({});
        setPreviews({});
      }
    } else {
      setIsOpen(open);

      if (!open) {
        form.reset();
        setSelectedFiles({});
        setPreviews({});
      }
    }
  };

  // DnDセンサーの設定
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // ドラッグ終了時のハンドラ
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = fields.findIndex((item) => item.id === active.id);
      const newIndex = fields.findIndex((item) => item.id === over?.id);

      // フォームフィールドの順序変更
      move(oldIndex, newIndex);

      // 関連する画像データも更新
      if (
        Object.keys(selectedFiles).length > 0 ||
        Object.keys(previews).length > 0
      ) {
        const newFiles: { [key: number]: File | null } = {};
        const newPreviews: { [key: number]: string } = {};

        // 古いインデックスから新しいインデックスに値をマップ
        Object.entries(selectedFiles).forEach(([key, value]) => {
          const index = parseInt(key);
          const newKey =
            index === oldIndex
              ? newIndex
              : index > oldIndex && index <= newIndex
                ? index - 1
                : index < oldIndex && index >= newIndex
                  ? index + 1
                  : index;
          newFiles[newKey] = value;
        });

        Object.entries(previews).forEach(([key, value]) => {
          const index = parseInt(key);
          const newKey =
            index === oldIndex
              ? newIndex
              : index > oldIndex && index <= newIndex
                ? index - 1
                : index < oldIndex && index >= newIndex
                  ? index + 1
                  : index;
          newPreviews[newKey] = value;
        });

        setSelectedFiles(newFiles);
        setPreviews(newPreviews);
      }
    }
  };

  // 画像ファイルを選択したときの処理
  const handleFileSelect = (index: number, file: File) => {
    if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
      toast.error('JPGまたはPNG形式の画像ファイルを選択してください');
      return;
    }

    setSelectedFiles((prev) => ({ ...prev, [index]: file }));

    // プレビュー用のURLを生成
    const reader = new FileReader();
    reader.onload = () => {
      setPreviews((prev) => ({
        ...prev,
        [index]: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  // 画像をアップロードする関数
  const uploadImage = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('画像のアップロードに失敗しました');
      }

      const data = await response.json();
      return data.url; // アップロードされた画像のURL
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('画像アップロードエラー:', error);
      throw new Error('画像のアップロードに失敗しました');
    }
  };

  // 画像を削除
  const removeImage = (index: number) => {
    setSelectedFiles((prev) => {
      const newFiles = { ...prev };
      delete newFiles[index];
      return newFiles;
    });

    setPreviews((prev) => {
      const newPreviews = { ...prev };
      delete newPreviews[index];
      return newPreviews;
    });

    // フォームの値もクリア
    const steps = form.getValues('steps');
    steps[index].imageUrl = '';
    form.setValue('steps', steps);
  };

  // 手順書を登録
  async function onSubmit(data: ProcedureManualFormValues) {
    try {
      // 画像がある場合はアップロード
      const updatedSteps = [...data.steps];

      // 画像ファイルがある場合はアップロード
      for (const [index, file] of Object.entries(selectedFiles)) {
        if (file) {
          try {
            const imageUrl = await uploadImage(file);
            updatedSteps[Number(index)].imageUrl = imageUrl;
          } catch {
            toast.error(
              `手順 ${Number(index) + 1} の画像アップロードに失敗しました`
            );
            return; // 失敗したら処理中断
          }
        }
      }

      const response = await fetch('/api/procedure-manuals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: data.title,
          steps: updatedSteps,
          customerId,
        }),
      });

      if (!response.ok) {
        throw new Error('手順書の登録に失敗しました');
      }

      toast.success(`『${data.title}』を登録しました`);
      setIsOpen(false);
      form.reset();
      // 選択ファイルとプレビューをリセット
      setSelectedFiles({});
      setPreviews({});
      router.refresh();
      // 手順書一覧ページへ遷移
      router.push(
        `/facilities/${facilityId}/customers/${customerId}/procedure-manuals`
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('手順書の追加中にエラーが発生しました:', error);
      toast.error('手順書の追加に失敗しました。もう一度お試しください');
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
          手順書を追加
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">手順書を登録</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <Label>
                    手順書のタイトル
                    <span className="text-destructive-foreground">*</span>
                  </Label>
                  <FormControl>
                    <Input
                      placeholder="例：入浴介助"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <h3 className="text-lg mb-2">手順</h3>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={fields.map((item) => item.id)}
                strategy={verticalListSortingStrategy}
              >
                {fields.map((field, index) => (
                  <SortableStepItem
                    key={field.id}
                    id={field.id}
                    index={index}
                    form={form}
                    previews={previews}
                    removeImage={removeImage}
                    handleFileSelect={handleFileSelect}
                    onRemove={remove}
                    fieldsLength={fields.length}
                  />
                ))}
              </SortableContext>
            </DndContext>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() =>
                append({ stepTitle: '', description: '', imageUrl: '' })
              }
            >
              <IoMdAdd className="h-4 w-4 mr-2" />
              手順を追加
            </Button>

            <DialogFooter>
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
