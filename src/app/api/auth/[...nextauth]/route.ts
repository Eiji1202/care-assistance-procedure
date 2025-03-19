import NextAuth from 'next-auth';
import GoogleProviders from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  throw new Error('Missing Google OAuth credentials in environment variables');
}

const handler = NextAuth({
  providers: [
    GoogleProviders({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30日
  },
  callbacks: {
    // @visionary.dayドメイン制限を保持
    async signIn({ user }) {
      if (user.email && user.email.endsWith('@visionary.day')) {
        return true;
      }
      return false;
    },
    async redirect({ url, baseUrl }) {
      // ベースURLの場合は/facilitiesにリダイレクト
      if (url === baseUrl || url === `${baseUrl}/`) {
        return `${baseUrl}/facilities`;
      }

      // その他の場合、URLをそのまま使用
      return url;
    }
  },
  pages: {
    signIn: '/',
    error: '/',
  }
});

export { handler as GET, handler as POST };
