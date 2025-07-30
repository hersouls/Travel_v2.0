import React from 'react';
import { clsx } from 'clsx';

interface BlurEffectProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  type?: 'backdrop' | 'background' | 'both';
  color?: 'white' | 'black' | 'moonwave' | 'custom';
  opacity?: number;
  customColor?: string;
}

export const BlurEffect: React.FC<BlurEffectProps> = ({
  children,
  className,
  intensity = 'md',
  type = 'backdrop',
  color = 'white',
  opacity = 0.1,
  customColor
}) => {
  const intensityClasses = {
    xs: 'backdrop-blur-xs',
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl',
    '2xl': 'backdrop-blur-2xl',
    '3xl': 'backdrop-blur-3xl'
  };

  const colorClasses = {
    white: 'bg-white',
    black: 'bg-black',
    moonwave: 'bg-moonwave-500',
    custom: ''
  };

  const typeClasses = {
    backdrop: intensityClasses[intensity],
    background: 'blur-md',
    both: `${intensityClasses[intensity]} blur-md`
  };

  const getBackgroundColor = () => {
    if (color === 'custom' && customColor) {
      return customColor;
    }
    return colorClasses[color];
  };

  return (
    <div
      className={clsx(
        'relative',
        typeClasses[type],
        className
      )}
      style={{
        backgroundColor: getBackgroundColor(),
        opacity: opacity
      }}
    >
      {children}
    </div>
  );
};

// 특화된 블러 효과 컴포넌트들
export const BackdropBlur: React.FC<Omit<BlurEffectProps, 'type'> & { type?: never }> = (props) => (
  <BlurEffect {...props} type="backdrop" />
);

export const BackgroundBlur: React.FC<Omit<BlurEffectProps, 'type'> & { type?: never }> = (props) => (
  <BlurEffect {...props} type="background" />
);

export const MoonwaveBlur: React.FC<Omit<BlurEffectProps, 'color'> & { color?: never }> = (props) => (
  <BlurEffect {...props} color="moonwave" />
);

export const SubtleBlur: React.FC<Omit<BlurEffectProps, 'intensity' | 'opacity'> & { intensity?: never; opacity?: never }> = (props) => (
  <BlurEffect {...props} intensity="sm" opacity={0.05} />
);

export const StrongBlur: React.FC<Omit<BlurEffectProps, 'intensity' | 'opacity'> & { intensity?: never; opacity?: never }> = (props) => (
  <BlurEffect {...props} intensity="xl" opacity={0.2} />
);