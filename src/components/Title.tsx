import { cn } from '@/lib/utils';
import React from 'react';

type Props = {
  children: React.ReactNode;
  underline?: boolean;
  className?: string;
};

export default function Title(props: Props) {
  const { children, underline = false, className } = props;
  return (
    <h1
      className={cn(
        'font-extrabold text-3xl',
        underline && 'underline underline-offset-8 decoration-2',
        className
      )}
    >
      {children}
    </h1>
  );
}
