import React, { useState } from 'react';
import { cn } from './ui/utils';

interface WaveButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
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
  disabled = false
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    if (disabled) return;
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 600);
    onClick?.();
  };

  const variants = {
    primary: 'bg-white/20 backdrop-blur-xl border border-white/30 text-white hover:bg-white/30',
    secondary: 'bg-white/10 backdrop-blur-md border border-white/20 text-white/90 hover:bg-white/20',
    ghost: 'bg-white/5 backdrop-blur-sm border border-white/10 text-white/80 hover:bg-white/15'
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