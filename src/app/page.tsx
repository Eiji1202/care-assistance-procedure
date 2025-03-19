'use client';

import Loader from '@/components/Loader';
import SignInButton from '@/components/SignInButton';
import { useSession } from 'next-auth/react';

export default function Home() {
  const { status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <SignInButton />
    </div>
  );
}
