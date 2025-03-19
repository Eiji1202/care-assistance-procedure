'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FormControl, FormField, FormItem, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Trash2, GripVertical, X, ImagePlus } from 'lucide-react';
import Image from 'next/image';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from './ui/context-menu';
import { UseFormReturn } from 'react-hook-form';
import { ProcedureManualFormValues } from '@/lib/schemas/procedureManuals';

export interface Props {
  id: string;
  index: number;
  form: UseFormReturn<ProcedureManualFormValues>;
  previews: { [key: number]: string };
  removeImage: (index: number) => void;
  handleFileSelect: (index: number, file: File) => void;
  onRemove: (index: number) => void;
  fieldsLength: number;
}

export default function SortableStepItem(props: Props) {
  const {
    id,
    index,
    form,
    previews,
    removeImage,
    handleFileSelect,
    onRemove,
    fieldsLength,
  } = props;

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="p-4 border rounded-md relative"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="text-muted-foreground" />
          </div>
          <p className="font-medium">手順 {index + 1}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => fieldsLength > 1 && onRemove(index)}
          disabled={fieldsLength <= 1}
          className="text-red-500 hover:text-red-700 hover:bg-transparent"
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">手順を削除</span>
        </Button>
      </div>

      <div className="space-y-4">
        <FormField
          control={form.control}
          name={`steps.${index}.stepTitle`}
          render={({ field }) => (
            <FormItem>
              <Label>
                タイトル
                <span className="text-destructive-foreground">*</span>
              </Label>
              <FormControl>
                <Input
                  placeholder="例：体温の測定"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`steps.${index}.description`}
          render={({ field }) => (
            <FormItem>
              <Label>
                説明
                <span className="text-destructive-foreground">*</span>
              </Label>
              <FormControl>
                <Textarea
                  placeholder="手順の詳細を入力してください"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <Label className="block mb-2">画像（任意）</Label>
          {previews[index] ? (
            <div className="relative w-full h-40 mb-2">
              <Image
                src={previews[index]}
                alt={`手順 ${index + 1} のプレビュー`}
                fill
                className="object-contain rounded-md"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 rounded-full"
                onClick={() => removeImage(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <ContextMenu>
              <ContextMenuTrigger>
                <div
                  className="border-2 border-dashed rounded-md p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => {
                    const input = document.getElementById(
                      `file-upload-${index}`
                    ) as HTMLInputElement;
                    if (input) input.click();
                  }}
                >
                  <ImagePlus className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-500">
                    クリックで画像をアップロード
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    または右クリックでその他のオプション
                  </p>
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/jpeg,image/png';
                    input.onchange = (e: Event) => {
                      const target = e.target as HTMLInputElement;
                      if (target.files?.[0]) {
                        handleFileSelect(index, target.files[0]);
                      }
                    };
                    input.click();
                  }}
                >
                  <span>ファイルから選択</span>
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          )}

          {/* 非表示のファイル入力フィールド */}
          <input
            type="file"
            id={`file-upload-${index}`}
            accept="image/jpeg,image/png"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleFileSelect(index, e.target.files[0]);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
