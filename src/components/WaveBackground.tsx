import React from 'react';

export const WaveBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-purple-500/30 to-pink-600/20" />
      
      {/* Animated wave orbs */}
      <div className="absolute inset-0">
        {/* Wave 1 - Blue */}
        <div 
          className="wave-1 absolute top-1/4 left-0 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl wave-float wave-optimized"
          style={{ animationDelay: '0s' }}
        />
        
        {/* Wave 2 - Purple */}
        <div 
          className="wave-2 absolute top-1/2 right-0 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl wave-float wave-optimized"
          style={{ animationDelay: '1s' }}
        />
        
        {/* Wave 3 - Pink */}
        <div 
          className="wave-3 absolute bottom-1/4 left-1/4 w-72 h-72 bg-pink-400/30 rounded-full blur-3xl wave-float wave-optimized"
          style={{ animationDelay: '2s' }}
        />
        
        {/* Wave 4 - Cyan (additional) */}
        <div 
          className="wave-4 absolute top-3/4 right-1/3 w-64 h-64 bg-cyan-400/25 rounded-full blur-3xl wave-float wave-optimized"
          style={{ animationDelay: '3s' }}
        />
        
        {/* Wave 5 - Violet (additional) */}
        <div 
          className="wave-5 absolute top-1/6 left-2/3 w-56 h-56 bg-violet-400/25 rounded-full blur-3xl wave-float wave-optimized"
          style={{ animationDelay: '1.5s' }}
        />
      </div>
      
      {/* Gradient overlay for better content visibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-black/5" />
    </div>
  );
};