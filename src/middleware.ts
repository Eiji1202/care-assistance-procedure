import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const session = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // パスを取得
  const path = request.nextUrl.pathname;

  // ルートパスで、ログイン済みの場合は施設一覧にリダイレクト
  if (path === '/' && session) {
    return NextResponse.redirect(new URL('/facilities', request.url));
  }

  // ログインページ自体はアクセス可能に
  if (path === '/') {
    return NextResponse.next();
  }

  // その他のすべてのパスでログインしていない場合はログインページにリダイレクト
  if (!session) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// 重要: ミドルウェアが適用されるパスを指定
export const config = {
  matcher: [
    '/',
    '/facilities/:path*',
  ],
};
