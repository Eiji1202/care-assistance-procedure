# 概要
- Next.js15とReact19を使ったwebアプリの作成
- テーマは『障害者向け介護事業所が利用できる、利用者さんの支援手順書の作成アプリ』（以前社内で運用するために作成を検討したが、破談となったため作ってみたかった）

# 使ったフレームワーク、ライブラリ等
- フロントエンドもバックエンドもTypeScript
- Next.js（v15）
- React（v19）
- Supabase（BaaS）
- Prisma（ORM）
- NextAuth（認証系）
- shadcn/ui（UIコンポーネント）
- TailWind CSS
- lucide-react（アイコン）
- react-icons（アイコン）
- React-Hook-Form（フォーム管理）
- zod（スキーマ宣言とデータ検証）
- dnd-kit（ドラッグアンドドロップ）
- qrcode.react（QRコード）

# 動作確認

  1. **ログイン**
      - @visionary.dayのドメインでしかログインできないように
      - ログイン後は施設一覧ページに遷移
  
        https://github.com/user-attachments/assets/65c525f3-3679-4b2b-ab3f-6c6197b8f85a

  2. **施設一覧ページ**
      - 施設の作成、削除ができる

        https://github.com/user-attachments/assets/391ee3a4-f52d-4925-adbe-809f6cf57a91

  3.  **利用者一覧ページ**
      - 施設一覧ページからアクセスできる
      - 利用者の作成、削除ができる

        https://github.com/user-attachments/assets/5d7bcdf3-64e7-473c-860c-9e2b3aece1ba

  4. **手順書作成ページ**
      - 利用者一覧ページからアクセスできる
      - 手順書の作成、削除ができる

        https://github.com/user-attachments/assets/b0f24d64-244d-42e9-aee1-30b4f366bd99

  5. **手順書詳細ページと編集ページ**
      - 手順書一覧ページからアクセスできる
      - 手順書の確認、QRコードの表示、手順書の編集ができる

        https://github.com/user-attachments/assets/685cf9c4-199f-4d02-8891-2c63392c65f6

# 所感
- useFormStatusを使ってpending状態を取得し、関数実行中はボタンを非活性にする、みたいな実装をしたが、普通にuseState使った方がいい場面もあって微妙に感じてしまった。
- APIを実行する関数については、直接APIのpathを指定してfetch関数実行するのか、APIを実行する関数を別ファイルに定義してその関数を呼び出して実行する（BFF）のかチームで方向性を決めて、どちらかに統一して実装したほうがいいと感じた。
