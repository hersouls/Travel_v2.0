import React, { useState } from 'react';
import { cn } from '../lib/utils';

interface WaveButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'travel';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  ariaLabel?: string;
  disabled?: boolean;
}

export const WaveButton: React.FC<WaveButtonProps> = ({ 
  children, 
  onClick,
  variant = 'primary',
  size = 'md',
  className,
  ariaLabel,
  disabled = false,
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    if (disabled) return;
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 600);
    onClick?.();
  };

  const variants = {
    primary: 'bg-primary-500/20 backdrop-blur-xl border border-primary-300/30 text-white hover:bg-primary-400/30',
    secondary: 'bg-glass-medium backdrop-blur-md border border-white/20 text-white/90 hover:bg-glass-strong',
    ghost: 'bg-glass-light backdrop-blur-sm border border-white/10 text-white/80 hover:bg-glass-medium',
    travel: 'bg-gradient-to-r from-travel-blue/20 to-travel-purple/20 backdrop-blur-lg border border-travel-blue/30 text-white hover:from-travel-blue/30 hover:to-travel-purple/30'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <button
      onClick={handleClick}
      aria-label={ariaLabel}
      disabled={disabled}
      className={cn(
        // Base styles
        'relative overflow-hidden rounded-xl font-semibold transition-all duration-300',
        'active:scale-95 transform focus:outline-none focus:ring-2 focus:ring-white/50',
        'touch-manipulation transform-gpu will-change-transform',
        'flex items-center justify-center', // 아이콘 중앙 정렬을 위한 기본 스타일
        
        // Variants and sizes
        variants[variant],
        sizes[size],
        
        // Disabled state
        disabled && 'opacity-50 cursor-not-allowed',
        
        // Custom className
        className
      )}
      {...props}
    >
      {/* Wave animation overlay */}
      <div 
        className={cn(
          'absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent',
          'wave-animation',
          disabled && 'hidden'
        )}
      />
      
      {/* Ripple effect on click */}
      {isPressed && (
        <div className="absolute inset-0 bg-white/20 wave-ripple rounded-xl" />
      )}
      
      {/* Content */}
      <span className="relative z-10 break-keep-ko flex items-center justify-center w-full h-full">
        {children}
      </span>
    </button>
  );
};