import { useRef, useEffect, useMemo } from 'react';

interface InputGroupSliderProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  onChange: (val: string) => void;
  formatValue?: (value: number) => string;
}

export const InputGroupSlider = ({ 
  label, 
  value, 
  min = 0, 
  max = 1, 
  step = 0.01, 
  disabled, 
  onChange,
  formatValue
}: InputGroupSliderProps) => {
  const sliderRef = useRef<HTMLInputElement>(null);
  const displayValue = formatValue ? formatValue(value) : value.toString();
  
  // Calculate percentage with proper bounds checking
  const percentage = useMemo(() => {
    const range = max - min;
    if (range <= 0) return 0;
    const clampedValue = Math.max(min, Math.min(max, value));
    const percent = ((clampedValue - min) / range) * 100;
    return Math.max(0, Math.min(100, percent));
  }, [value, min, max]);

  // Directly update the background style using ref - bypasses React reconciliation issues
  // This is the most reliable approach for production builds
  useEffect(() => {
    if (sliderRef.current) {
      const background = `linear-gradient(to right, rgb(249 115 22) 0%, rgb(249 115 22) ${percentage}%, rgb(51 65 85) ${percentage}%, rgb(51 65 85) 100%)`;
      // Use setProperty with important flag to override any Tailwind classes
      sliderRef.current.style.setProperty('background', background, 'important');
    }
  }, [percentage]);

  return (
    <div className='flex flex-col gap-2'>
      <label className='text-xs font-bold text-slate-400 uppercase tracking-wider'>{label}</label>
      <div className='flex items-center gap-4'>
        <input
          ref={sliderRef}
          type='range'
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className='flex-1 h-2 rounded-lg appearance-none cursor-pointer accent-orange-500 disabled:opacity-50 disabled:cursor-not-allowed'
        />
        {formatValue && (
          <span className='text-slate-300 font-mono text-sm w-12 text-right'>
            {displayValue}
          </span>
        )}
      </div>
    </div>
  );
};
