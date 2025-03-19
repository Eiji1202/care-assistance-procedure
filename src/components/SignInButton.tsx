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
import { useState } from 'react';
import Loader from './Loader';

export default function SignInButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      await signIn('google', {
        callbackUrl: `/facilities`,
        redirect: true,
      });
      toast.success('ログインに成功しました');
    } catch {
      toast.error('ログインに失敗しました。もう一度お試しください。');
      setIsLoading(false);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleSignIn}
            className="flex items-center"
            size="xl"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader />
            ) : (
              <>
                <FaGoogle />
                ログイン
              </>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>@visionary.dayのメールアドレスでしかログインできません。</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
