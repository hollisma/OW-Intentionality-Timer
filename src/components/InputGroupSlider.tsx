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
  const displayValue = formatValue ? formatValue(value) : value.toString();
  const percentage = max > 0 ? ((value - min) / (max - min)) * 100 : 0;

  return (
    <div className='flex flex-col gap-2'>
      <label className='text-xs font-bold text-slate-400 uppercase tracking-wider'>{label}</label>
      <div className='flex items-center gap-4'>
        <input
          type='range'
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className='flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500 disabled:opacity-50 disabled:cursor-not-allowed'
          style={{
            background: `linear-gradient(to right, rgb(249 115 22) 0%, rgb(249 115 22) ${percentage}%, rgb(51 65 85) ${percentage}%, rgb(51 65 85) 100%)`
          }}
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
