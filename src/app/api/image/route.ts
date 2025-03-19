import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'ファイルがアップロードされていません' },
        { status: 400 }
      );
    }

    // ファイルの型チェック
    if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
      return NextResponse.json(
        { error: 'JPGまたはPNG形式の画像ファイルのみアップロード可能です' },
        { status: 400 }
      );
    }

    // ファイル名を一意にする
    const uniqueFileName = `${uuidv4()}-${file.name.replace(/\s+/g, '-')}`;

    // publicディレクトリへの保存パス
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

    // uploadsディレクトリが存在しない場合は作成
    try {
      if (!fs.existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
        // eslint-disable-next-line no-console
        console.log(`ディレクトリを作成しました: ${uploadsDir}`);
      }
    } catch (mkdirError) {
      // eslint-disable-next-line no-console
      console.error('ディレクトリ作成エラー:', mkdirError);
      return NextResponse.json(
        { error: 'アップロードディレクトリの作成に失敗しました' },
        { status: 500 }
      );
    }

    const filePath = path.join(uploadsDir, uniqueFileName);

    // ファイルをバッファに変換
    const buffer = Buffer.from(await file.arrayBuffer());

    try {
      // ファイルを書き込む
      await writeFile(filePath, buffer);
      // eslint-disable-next-line no-console
      console.log(`ファイルを保存しました: ${filePath}`);
    } catch (writeError) {
      // eslint-disable-next-line no-console
      console.error('ファイル書き込みエラー:', writeError);
      return NextResponse.json(
        { error: 'ファイルの書き込みに失敗しました' },
        { status: 500 }
      );
    }

    // クライアントが参照できるURLを返す
    const fileUrl = `/uploads/${uniqueFileName}`;

    return NextResponse.json({ url: fileUrl }, { status: 201 });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('ファイルアップロードエラー詳細:', error);
    return NextResponse.json(
      { error: 'ファイルのアップロードに失敗しました' },
      { status: 500 }
    );
  }
}

// App Routerの設定（bodyParserの設定は異なる方法で行う）
export const config = {
  api: {
    responseLimit: '10mb',
    // bodyParserは自動的に処理されるため設定不要
  },
};
