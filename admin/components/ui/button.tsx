import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export function Button({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  ...props 
}: ButtonProps) {
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-900/20',
    secondary: 'bg-zinc-800 text-white hover:bg-zinc-700 border border-white/5',
    ghost: 'hover:bg-white/5 text-slate-400 hover:text-white',
    danger: 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
    icon: 'p-2'
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
