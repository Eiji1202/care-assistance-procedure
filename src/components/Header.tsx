'use client';

import Image from 'next/image';
import { useSession } from 'next-auth/react';
import SignOutButton from './SignOutButton';

export default function Header() {
  const { data: session } = useSession();
  return (
    <header className="h-16 flex items-center shadow-md sticky top-0 z-10 bg-white">
      <div className="flex items-center container mx-auto justify-between">
        <Image
          src="/visionaryLogo.png"
          alt="visionaryLogo"
          width={160}
          height={40}
        />
        {session && <SignOutButton />}
      </div>
    </header>
  );
}
