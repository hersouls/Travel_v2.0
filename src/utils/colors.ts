/**
 * Simplified Moonwave Color System
 * Primary, Secondary, Grayscale/Border/BG, State
 */

// =============================================================================
// PRIMARY COLORS
// =============================================================================
export const primaryColors = {
  DEFAULT: '#3b82f6',
  foreground: '#ffffff',
  hover: '#2563eb',
  active: '#1d4ed8',
  light: '#dbeafe',
} as const;

// =============================================================================
// SECONDARY COLORS  
// =============================================================================
export const secondaryColors = {
  DEFAULT: '#a855f7',
  foreground: '#ffffff',
  hover: '#9333ea',
  active: '#7e22ce',
  light: '#e9d5ff',
} as const;

// =============================================================================
// GRAYSCALE/BORDER/BG COLORS
// =============================================================================
export const grayscaleColors = {
  background: '#0f0f23',
  foreground: '#f8fafc',
  card: '#1a1a2e',
  muted: '#16213e',
  'muted-foreground': '#8b8da6',
  border: 'rgba(255, 255, 255, 0.1)',
} as const;

// =============================================================================
// STATE COLORS
// =============================================================================
export const stateColors = {
  success: {
    DEFAULT: '#10b981',
    foreground: '#ffffff',
    light: '#d1fae5',
  },
  warning: {
    DEFAULT: '#f59e0b', 
    foreground: '#ffffff',
    light: '#fed7aa',
  },
  error: {
    DEFAULT: '#ef4444',
    foreground: '#ffffff', 
    light: '#fee2e2',
  },
  info: {
    DEFAULT: '#3b82f6',
    foreground: '#ffffff',
    light: '#dbeafe',
  },
} as const;

// =============================================================================
// SIMPLIFIED UTILITY FUNCTIONS
// =============================================================================

/**
 * Get state color configuration
 */
export const getStateColor = (state: 'success' | 'warning' | 'error' | 'info') => {
  return stateColors[state];
};

/**
 * Get Tailwind classes for colors
 */
export const colorClasses = {
  // Primary color classes
  primary: {
    bg: 'bg-primary',
    text: 'text-primary', 
    border: 'border-primary',
    hover: 'hover:bg-primary-hover',
  },
  
  // Secondary color classes
  secondary: {
    bg: 'bg-secondary',
    text: 'text-secondary',
    border: 'border-secondary', 
    hover: 'hover:bg-secondary-hover',
  },
  
  // State color classes
  state: {
    success: {
      bg: 'bg-success',
      text: 'text-success',
      light: 'bg-success-light',
    },
    warning: {
      bg: 'bg-warning', 
      text: 'text-warning',
      light: 'bg-warning-light',
    },
    error: {
      bg: 'bg-error',
      text: 'text-error', 
      light: 'bg-error-light',
    },
    info: {
      bg: 'bg-info',
      text: 'text-info',
      light: 'bg-info-light',
    },
  },
} as const;

/**
 * Generate glassmorphism background  
 */
export const getGlassBackground = (variant: 'primary' | 'secondary' | 'mixed' = 'primary') => {
  const variants = {
    primary: 'bg-gradient-to-br from-blue-400/20 to-blue-600/20',
    secondary: 'bg-gradient-to-br from-purple-400/20 to-purple-600/20', 
    mixed: 'bg-gradient-to-br from-blue-400/20 to-purple-600/20',
  };
  
  return `${variants[variant]} bg-white/10 backdrop-blur-md border border-white/20`;
};

/**
 * Wave animation color variants - simplified
 */
export const waveColorVariants = {
  primary: 'from-primary/30 via-primary-hover/20 to-primary-active/30',
  secondary: 'from-secondary/30 via-secondary-hover/20 to-secondary-active/30',
  mixed: 'from-primary/30 via-secondary/20 to-primary-active/30',
} as const;

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
export type ColorVariant = 'primary' | 'secondary' | 'mixed';
export type StateColor = 'success' | 'warning' | 'error' | 'info';

/**
 * Legacy support for existing components that might use theme colors
 */
export const getThemeColor = (theme: 'beginning' | 'growth' | 'challenge' | 'shine') => {
  // Map old theme colors to new simplified system
  const themeMapping = {
    beginning: primaryColors,
    growth: secondaryColors, 
    challenge: stateColors.warning,
    shine: stateColors.success,
  };
  
  return themeMapping[theme];
};

export const getThemeColorClass = (theme: 'beginning' | 'growth' | 'challenge' | 'shine') => {
  const classMapping = {
    beginning: 'text-primary',
    growth: 'text-secondary',
    challenge: 'text-warning', 
    shine: 'text-success',
  };
  
  return classMapping[theme];
};

/**
 * Legacy getPhaseColors function for backward compatibility
 */
export const getPhaseColors = (phase: 'beginning' | 'growth' | 'challenge' | 'shine') => {
  const colors = {
    beginning: {
      gradient: 'from-blue-400/30 to-cyan-400/30',
      text: 'text-blue-400',
      bg: 'bg-blue-400/20',
      border: 'border-blue-400/30'
    },
    growth: {
      gradient: 'from-purple-400/30 to-violet-400/30',
      text: 'text-purple-400',
      bg: 'bg-purple-400/20',
      border: 'border-purple-400/30'
    },
    challenge: {
      gradient: 'from-orange-400/30 to-red-400/30',
      text: 'text-orange-400',
      bg: 'bg-orange-400/20',
      border: 'border-orange-400/30'
    },
    shine: {
      gradient: 'from-yellow-400/30 to-amber-400/30',
      text: 'text-yellow-400',
      bg: 'bg-yellow-400/20',
      border: 'border-yellow-400/30'
    }
  };
  
  return colors[phase];
};

/**
 * Legacy getPhaseGlassBackground function for backward compatibility
 */
export const getPhaseGlassBackground = (theme: 'beginning' | 'growth' | 'challenge' | 'shine') => {
  const phaseColors = getPhaseColors(theme);
  return `${phaseColors.gradient} bg-white/10 backdrop-blur-md border border-white/20`;
};