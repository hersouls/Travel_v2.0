import React from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  onClick,
  hover = true
}) => {
  return (
    <div
      className={clsx(
        'bg-glass-primary border border-glass-border rounded-xl backdrop-blur-sm transition-all duration-300',
        hover && 'hover:bg-glass-secondary hover:border-glass-border hover:shadow-glow cursor-pointer',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};