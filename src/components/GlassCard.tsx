import React from 'react';
import { cn } from '../lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'strong' | 'light' | 'travel';
  withWaveEffect?: boolean;
  hoverable?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className,
  variant = 'default',
  withWaveEffect = false,
  hoverable = true,
  onClick,
  onKeyDown,
  ...props
}) => {
  const variants = {
    default: 'bg-glass-light backdrop-blur-md border border-white/20',
    strong: 'bg-glass-strong backdrop-blur-xl border border-white/30',
    light: 'bg-glass-light backdrop-blur-sm border border-white/10',
    travel: 'bg-gradient-to-br from-primary-500/10 via-glass-medium to-travel-blue/10 backdrop-blur-lg border border-primary-300/20'
  } as const;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (onClick && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      // React.MouseEvent과 호환되는 최소 속성만 전달
      const syntheticClick = event as unknown as React.MouseEvent<HTMLDivElement>;
      onClick(syntheticClick);
    }
    onKeyDown?.(event);
  };

  return (
    <div 
      className={cn(
        // Base glass effect using standard Tailwind utilities
        variants[variant],
        'rounded-2xl p-6 shadow-lg',
        
        // Hover effects
        hoverable && 'transition-all duration-300 hover:bg-white/15 hover:border-white/30 hover:translate-y-[-2px] hover:shadow-xl',
        
        // Wave effects
        withWaveEffect && 'relative overflow-hidden',
        
        // Performance optimization
        'transform-gpu will-change-transform',
        
        // Custom className
        className
      )}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      {...props}
    >
      {/* Wave effect lines */}
      {withWaveEffect && (
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent wave-animation" />
          <div 
            className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent wave-animation" 
            style={{ animationDelay: '1s' }} 
          />
        </div>
      )}
      
      {/* Content */}
      <div className={cn('relative z-10', withWaveEffect && 'relative')}>
        {children}
      </div>
    </div>
  );
};