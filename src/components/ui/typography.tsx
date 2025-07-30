import React from 'react';
import { cn } from './utils';

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

export const Typography = {
  H1: ({ children, className }: TypographyProps) => (
    <h1 className={cn(
      'text-4xl sm:text-5xl lg:text-6xl',
      'font-bold tracking-ko-tight',
      'text-white break-keep-ko',
      className
    )}>
      {children}
    </h1>
  ),

  H2: ({ children, className }: TypographyProps) => (
    <h2 className={cn(
      'text-3xl sm:text-4xl lg:text-5xl',
      'font-bold tracking-ko-tight',
      'text-white break-keep-ko',
      className
    )}>
      {children}
    </h2>
  ),

  H3: ({ children, className }: TypographyProps) => (
    <h3 className={cn(
      'text-2xl sm:text-3xl lg:text-4xl',
      'font-semibold tracking-ko-tight',
      'text-white break-keep-ko',
      className
    )}>
      {children}
    </h3>
  ),

  H4: ({ children, className }: TypographyProps) => (
    <h4 className={cn(
      'text-xl sm:text-2xl lg:text-3xl',
      'font-semibold tracking-ko-normal',
      'text-white break-keep-ko',
      className
    )}>
      {children}
    </h4>
  ),

  Body: ({ children, className }: TypographyProps) => (
    <p className={cn(
      'text-base lg:text-lg',
      'font-normal tracking-ko-normal',
      'text-white/90 leading-relaxed break-keep-ko',
      className
    )}>
      {children}
    </p>
  ),

  BodySmall: ({ children, className }: TypographyProps) => (
    <p className={cn(
      'text-sm lg:text-base',
      'font-normal tracking-ko-normal',
      'text-white/80 leading-relaxed break-keep-ko',
      className
    )}>
      {children}
    </p>
  ),

  Caption: ({ children, className }: TypographyProps) => (
    <p className={cn(
      'text-xs lg:text-sm',
      'font-normal tracking-ko-normal',
      'text-white/70 leading-relaxed break-keep-ko',
      className
    )}>
      {children}
    </p>
  ),

  Display: ({ children, className }: TypographyProps) => (
    <h1 className={cn(
      'text-5xl sm:text-6xl lg:text-7xl',
      'font-black tracking-ko-tight',
      'text-white break-keep-ko',
      className
    )}>
      {children}
    </h1>
  ),

  Quote: ({ children, className }: TypographyProps) => (
    <blockquote className={cn(
      'text-lg lg:text-xl',
      'font-medium tracking-ko-normal italic',
      'text-white/90 leading-relaxed break-keep-ko',
      'border-l-4 border-white/30 pl-4',
      className
    )}>
      {children}
    </blockquote>
  ),

  Code: ({ children, className }: TypographyProps) => (
    <code className={cn(
      'text-sm',
      'font-mono font-medium',
      'bg-white/10 text-white/90',
      'px-2 py-1 rounded',
      'break-keep-ko',
      className
    )}>
      {children}
    </code>
  ),

  Label: ({ children, className }: TypographyProps) => (
    <span className={cn(
      'text-sm',
      'font-medium tracking-ko-normal',
      'text-white/80 break-keep-ko',
      className
    )}>
      {children}
    </span>
  ),

  Number: ({ children, className }: TypographyProps) => (
    <span className={cn(
      'text-numeric',
      'font-bold tracking-ko-tight',
      'text-white break-keep-ko',
      className
    )}>
      {children}
    </span>
  )
}; 