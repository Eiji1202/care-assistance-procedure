import { signOut } from 'next-auth/react';
import { Button } from './ui/button';
import { GoSignOut } from 'react-icons/go';

export default function SignOutButton() {
  const handleSignOut = () => {
    const res = confirm('本当にログアウトしますか？');
    if (!res) return;
    signOut({ callbackUrl: '/' });
  };

  return (
    <Button
      onClick={handleSignOut}
      className="flex items-center"
      size="lg"
      variant="secondary"
    >
      <GoSignOut />
      ログアウト
    </Button>
  );
}
