import React from 'react';
import { clsx } from 'clsx';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'elevated' | 'subtle' | 'colored';
  size?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  blur?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  border?: boolean;
  shadow?: boolean;
  animated?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  onClick,
  variant = 'default',
  size = 'md',
  hover = true,
  blur = 'md',
  border = true,
  shadow = true,
  animated = false
}) => {
  const variantClasses = {
    default: 'bg-glass-primary border-glass-border',
    elevated: 'bg-glass-primary/20 border-glass-border/30 shadow-glow',
    subtle: 'bg-glass-secondary/50 border-glass-border/20',
    colored: 'bg-gradient-to-br from-moonwave-500/10 to-moonwave-600/10 border-moonwave-400/30'
  };

  const sizeClasses = {
    sm: 'p-3 rounded-lg',
    md: 'p-4 rounded-xl',
    lg: 'p-6 rounded-2xl'
  };

  const blurClasses = {
    xs: 'backdrop-blur-xs',
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl'
  };

  const shadowClasses = shadow ? 'shadow-glass' : '';
  const borderClasses = border ? 'border' : '';
  const animatedClasses = animated ? 'animate-float' : '';
  const hoverClasses = hover ? 'hover:bg-glass-secondary hover:border-glass-border/40 hover:shadow-glow transition-all duration-300' : '';

  return (
    <div
      className={clsx(
        'relative overflow-hidden',
        variantClasses[variant],
        sizeClasses[size],
        blurClasses[blur],
        shadowClasses,
        borderClasses,
        animatedClasses,
        hoverClasses,
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {/* 글래스 효과 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      
      {/* 내부 콘텐츠 */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

// 특화된 글래스 카드 컴포넌트들
export const ElevatedGlassCard: React.FC<Omit<GlassCardProps, 'variant'> & { variant?: never }> = (props) => (
  <GlassCard {...props} variant="elevated" />
);

export const SubtleGlassCard: React.FC<Omit<GlassCardProps, 'variant'> & { variant?: never }> = (props) => (
  <GlassCard {...props} variant="subtle" />
);

export const ColoredGlassCard: React.FC<Omit<GlassCardProps, 'variant'> & { variant?: never }> = (props) => (
  <GlassCard {...props} variant="colored" />
);

export const AnimatedGlassCard: React.FC<Omit<GlassCardProps, 'animated'> & { animated?: never }> = (props) => (
  <GlassCard {...props} animated={true} />
);