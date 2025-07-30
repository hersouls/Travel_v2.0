import React from 'react';
import { GlassCard } from './GlassCard';
import { primaryColors, secondaryColors, grayscaleColors, stateColors } from '../utils/colors';

export const ColorShowcase: React.FC = () => {
  return (
    <div className="p-8 space-y-8">
      {/* Primary Colors */}
      <GlassCard variant="strong">
        <h2 className="text-2xl font-bold text-white mb-6 break-keep-ko">
          Primary Colors
        </h2>
        
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {Object.entries(primaryColors).map(([variant, color]) => (
            <div key={variant} className="text-center">
              <div 
                className="w-16 h-16 rounded-lg shadow-lg border border-white/20 mb-2 mx-auto"
                style={{ backgroundColor: color }}
              />
              <div className="text-white/80 text-sm font-medium capitalize">{variant.replace('DEFAULT', 'primary')}</div>
              <div className="text-white/60 text-xs font-mono">{color}</div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Secondary Colors */}
      <GlassCard variant="strong">
        <h2 className="text-2xl font-bold text-white mb-6 break-keep-ko">
          Secondary Colors
        </h2>
        
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {Object.entries(secondaryColors).map(([variant, color]) => (
            <div key={variant} className="text-center">
              <div 
                className="w-16 h-16 rounded-lg shadow-lg border border-white/20 mb-2 mx-auto"
                style={{ backgroundColor: color }}
              />
              <div className="text-white/80 text-sm font-medium capitalize">{variant.replace('DEFAULT', 'secondary')}</div>
              <div className="text-white/60 text-xs font-mono">{color}</div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Grayscale/Border/BG Colors */}
      <GlassCard variant="strong">
        <h2 className="text-2xl font-bold text-white mb-6 break-keep-ko">
          Grayscale / Border / Background
        </h2>
        
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(grayscaleColors).map(([variant, color]) => (
            <div key={variant} className="text-center">
              <div 
                className="w-16 h-16 rounded-lg shadow-lg border border-white/20 mb-2 mx-auto"
                style={{ backgroundColor: typeof color === 'string' && color.startsWith('rgba') ? color : color }}
              />
              <div className="text-white/80 text-sm font-medium capitalize">{variant.replace('-', ' ')}</div>
              <div className="text-white/60 text-xs font-mono">{color}</div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* State Colors */}
      <GlassCard variant="strong">
        <h2 className="text-2xl font-bold text-white mb-6 break-keep-ko">
          State Colors
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {Object.entries(stateColors).map(([state, colors]) => (
            <div key={state} className="space-y-3">
              <h3 className="text-lg font-semibold text-white capitalize break-keep-ko">
                {state}
              </h3>
              <div className="space-y-2">
                {Object.entries(colors).map(([variant, color]) => (
                  <div key={variant} className="flex items-center space-x-3">
                    <div 
                      className="w-8 h-8 rounded-md shadow-md border border-white/20"
                      style={{ backgroundColor: color }}
                    />
                    <div>
                      <div className="text-white/80 text-sm font-medium capitalize">
                        {variant.replace('DEFAULT', state)}
                      </div>
                      <div className="text-white/60 text-xs font-mono">{color}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Usage Examples */}
      <GlassCard variant="strong">
        <h2 className="text-2xl font-bold text-white mb-6 break-keep-ko">
          사용 예제
        </h2>
        
        <div className="space-y-6">
          {/* Primary & Secondary Buttons */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 break-keep-ko">
              Primary & Secondary 버튼
            </h3>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary-hover transition-colors">
                Primary Button
              </button>
              <button className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground font-medium hover:bg-secondary-hover transition-colors">
                Secondary Button
              </button>
              <button className="px-4 py-2 rounded-lg border border-primary text-primary font-medium hover:bg-primary hover:text-white transition-colors">
                Primary Outline
              </button>
              <button className="px-4 py-2 rounded-lg border border-secondary text-secondary font-medium hover:bg-secondary hover:text-white transition-colors">
                Secondary Outline
              </button>
            </div>
          </div>
          
          {/* State indicators */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 break-keep-ko">
              상태 표시자
            </h3>
            <div className="flex flex-wrap gap-3">
              <div className="px-3 py-1 rounded-full bg-success text-success-foreground text-sm font-medium">
                Success
              </div>
              <div className="px-3 py-1 rounded-full bg-warning text-warning-foreground text-sm font-medium">
                Warning
              </div>
              <div className="px-3 py-1 rounded-full bg-error text-error-foreground text-sm font-medium">
                Error
              </div>
              <div className="px-3 py-1 rounded-full bg-info text-info-foreground text-sm font-medium">
                Info
              </div>
            </div>
          </div>

          {/* Light state variants */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 break-keep-ko">
              Light 상태 색상
            </h3>
            <div className="flex flex-wrap gap-3">
              <div className="px-3 py-2 rounded-lg bg-success-light text-success border border-success/20 text-sm font-medium">
                Success Light
              </div>
              <div className="px-3 py-2 rounded-lg bg-warning-light text-warning border border-warning/20 text-sm font-medium">
                Warning Light
              </div>
              <div className="px-3 py-2 rounded-lg bg-error-light text-error border border-error/20 text-sm font-medium">
                Error Light
              </div>
              <div className="px-3 py-2 rounded-lg bg-info-light text-info border border-info/20 text-sm font-medium">
                Info Light
              </div>
            </div>
          </div>

          {/* Gradient examples */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 break-keep-ko">
              그라데이션
            </h3>
            <div className="space-y-3">
              <div className="h-12 rounded-lg gradient-primary flex items-center justify-center text-white font-medium">
                Primary Gradient
              </div>
              <div className="h-12 rounded-lg gradient-secondary flex items-center justify-center text-white font-medium">
                Secondary Gradient
              </div>
              <div className="h-12 rounded-lg gradient-mixed flex items-center justify-center text-white font-medium">
                Mixed Gradient
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};