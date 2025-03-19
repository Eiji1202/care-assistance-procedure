'use client';

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
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
import { ArrowLeft } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import Loader from './Loader';

type EditProcedureManualType = {
  id: string;
  title: string;
  steps: Array<{
    stepTitle: string;
    description: string;
    imageUrl?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
};

interface EditProcedureManualFormProps {
  procedureManual: EditProcedureManualType;
  facilityId: string;
  customerId: string;
}

export default function EditProcedureManualForm({
  procedureManual,
  facilityId,
  customerId,
}: EditProcedureManualFormProps) {
  const [selectedFiles, setSelectedFiles] = useState<{
    [key: number]: File | null;
  }>({});
  const [previews, setPreviews] = useState<{ [key: number]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const router = useRouter();

  const form = useForm<ProcedureManualFormValues>({
    resolver: zodResolver(procedureManualSchema),
    defaultValues: {
      title: procedureManual.title,
      steps: procedureManual.steps,
    },
  });

  // 手順の追加・削除・移動
  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: 'steps',
  });

  // 既存の画像をプレビューにセット
  useEffect(() => {
    const initialPreviews: { [key: number]: string } = {};
    procedureManual.steps.forEach((step, index) => {
      if (step.imageUrl) {
        initialPreviews[index] = step.imageUrl;
      }
    });
    setPreviews(initialPreviews);
  }, [procedureManual.steps]);

  // 編集をキャンセルして詳細ページに戻る前に確認
  const handleCancelEdit = () => {
    if (
      form.formState.isDirty ||
      hasChanges ||
      Object.keys(selectedFiles).length > 0
    ) {
      const confirmCancel = window.confirm(
        '変更内容が保存されていません。キャンセルしてもよろしいですか？'
      );
      if (confirmCancel) {
        router.push(
          `/facilities/${facilityId}/customers/${customerId}/procedure-manuals/${procedureManual.id}`
        );
      }
    } else {
      router.push(
        `/facilities/${facilityId}/customers/${customerId}/procedure-manuals/${procedureManual.id}`
      );
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
      // 順序変更してもフォームに変更があったこととしてマーク
      setHasChanges(true);

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
    setHasChanges(true);

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
    form.setValue('steps', steps, {
      shouldDirty: true, // フォームを "dirty" とマーク
      shouldTouch: true, // フィールドを "touched" とマーク
    });

    setHasChanges(true); // 画像削除も変更として追跡
  };

  // 手順書を更新
  async function onSubmit(data: ProcedureManualFormValues) {
    if (isSubmitting) return;
    setIsSubmitting(true);

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
            setIsSubmitting(false);
            return; // 失敗したら処理中断
          }
        }
      }

      const response = await fetch(
        `/api/procedure-manuals/${procedureManual.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: data.title,
            steps: updatedSteps,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('手順書の更新に失敗しました');
      }

      toast.success(`『${data.title}』を更新しました`);
      router.refresh();
      setHasChanges(false);
      router.push(
        `/facilities/${facilityId}/customers/${customerId}/procedure-manuals/${procedureManual.id}`
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('手順書の更新中にエラーが発生しました:', error);
      toast.error('手順書の更新に失敗しました。もう一度お試しください');
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleBeforeUnload = React.useCallback(
    (e: BeforeUnloadEvent) => {
      if (
        form.formState.isDirty ||
        hasChanges ||
        Object.keys(selectedFiles).length > 0
      ) {
        e.preventDefault();
        return '';
      }
    },
    [form.formState.isDirty, hasChanges, selectedFiles]
  );

  // ページから離れる前に警告を表示
  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [handleBeforeUnload]);

  return (
    <div className="container mx-auto max-w-[860px]">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          onClick={handleCancelEdit}
          className="text-sm text-muted-foreground hover:bg-transparent hover:underline underline-offset-4 hover:text-muted-foreground transition-none"
        >
          <ArrowLeft />
          手順書詳細に戻る
        </Button>
      </div>
      <ScrollArea className="h-[70vh] [&_[data-slot=scroll-area-scrollbar]]:hidden">
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

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting}
                size="lg"
              >
                {isSubmitting ? <Loader /> : '更新する'}
              </Button>
            </div>
          </form>
        </Form>
      </ScrollArea>
    </div>
  );
}
