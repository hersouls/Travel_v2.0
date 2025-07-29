import React from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  showHeader = true,
  className
}) => {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-moonwave-900 via-moonwave-800 to-moonwave-900 ${className}`}>
      {showHeader && <Header />}
      
      <main className={`${showHeader ? 'pt-20' : ''} min-h-screen`}>
        {children}
      </main>
    </div>
  );
};