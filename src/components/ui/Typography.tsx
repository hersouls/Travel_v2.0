import React from 'react';
import { clsx } from 'clsx';

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  variant?: 'display' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'body-sm' | 'caption' | 'overline';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  color?: 'primary' | 'secondary' | 'muted' | 'accent' | 'white' | 'inherit';
  align?: 'left' | 'center' | 'right' | 'justify';
  truncate?: boolean;
}

export const Typography: React.FC<TypographyProps> = ({
  children,
  className,
  as: Component = 'div',
  variant = 'body',
  weight = 'normal',
  color = 'inherit',
  align = 'left',
  truncate = false
}) => {
  const variantClasses = {
    display: 'text-6xl sm:text-7xl lg:text-8xl font-extrabold leading-tight',
    h1: 'text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight',
    h2: 'text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight',
    h3: 'text-2xl sm:text-3xl lg:text-4xl font-semibold leading-tight',
    h4: 'text-xl sm:text-2xl lg:text-3xl font-semibold leading-tight',
    h5: 'text-lg sm:text-xl lg:text-2xl font-medium leading-tight',
    h6: 'text-base sm:text-lg lg:text-xl font-medium leading-tight',
    body: 'text-base sm:text-lg leading-relaxed',
    'body-sm': 'text-sm sm:text-base leading-relaxed',
    caption: 'text-xs sm:text-sm leading-relaxed',
    overline: 'text-xs font-medium uppercase tracking-wider'
  };

  const weightClasses = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold'
  };

  const colorClasses = {
    primary: 'text-white',
    secondary: 'text-gray-300',
    muted: 'text-gray-400',
    accent: 'text-moonwave-400',
    white: 'text-white',
    inherit: 'text-inherit'
  };

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify'
  };

  return (
    <Component
      className={clsx(
        'font-pretendard',
        variantClasses[variant],
        weightClasses[weight],
        colorClasses[color],
        alignClasses[align],
        truncate && 'truncate',
        className
      )}
    >
      {children}
    </Component>
  );
};

// 특화된 컴포넌트들
export const Display: React.FC<Omit<TypographyProps, 'variant'> & { variant?: never }> = (props) => (
  <Typography {...props} variant="display" />
);

export const Heading1: React.FC<Omit<TypographyProps, 'variant'> & { variant?: never }> = (props) => (
  <Typography {...props} variant="h1" as="h1" />
);

export const Heading2: React.FC<Omit<TypographyProps, 'variant'> & { variant?: never }> = (props) => (
  <Typography {...props} variant="h2" as="h2" />
);

export const Heading3: React.FC<Omit<TypographyProps, 'variant'> & { variant?: never }> = (props) => (
  <Typography {...props} variant="h3" as="h3" />
);

export const Heading4: React.FC<Omit<TypographyProps, 'variant'> & { variant?: never }> = (props) => (
  <Typography {...props} variant="h4" as="h4" />
);

export const Heading5: React.FC<Omit<TypographyProps, 'variant'> & { variant?: never }> = (props) => (
  <Typography {...props} variant="h5" as="h5" />
);

export const Heading6: React.FC<Omit<TypographyProps, 'variant'> & { variant?: never }> = (props) => (
  <Typography {...props} variant="h6" as="h6" />
);

export const Body: React.FC<Omit<TypographyProps, 'variant'> & { variant?: 'body' | 'body-sm' }> = (props) => (
  <Typography {...props} variant={props.variant || 'body'} as="p" />
);

export const Caption: React.FC<Omit<TypographyProps, 'variant'> & { variant?: never }> = (props) => (
  <Typography {...props} variant="caption" />
);

export const Overline: React.FC<Omit<TypographyProps, 'variant'> & { variant?: never }> = (props) => (
  <Typography {...props} variant="overline" />
);