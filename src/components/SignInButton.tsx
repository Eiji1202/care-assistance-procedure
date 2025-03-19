import { signIn } from 'next-auth/react';
import { Button } from './ui/button';
import { FaGoogle } from 'react-icons/fa';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { toast } from 'sonner';

export default function SignInButton() {
  const handleSignIn = async () => {
    await signIn('google', { callbackUrl: '/facilities' });
    toast.success('ログインに成功しました');
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleSignIn}
            className="flex items-center"
            size="xl"
          >
            <FaGoogle />
            ログイン
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>@visionary.dayのメールアドレスでしかログインできません。</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
