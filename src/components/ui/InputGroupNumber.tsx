import { useRef } from 'react';

interface InputGroupNumberProps {
  label: string;
  value: string | number;
  disabled?: boolean;
  onChange: (val: string) => void;
}

export const InputGroupNumber = ({ label, value, disabled, onChange }: InputGroupNumberProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleStepDown = () => {
    if (inputRef.current && !disabled) {
      inputRef.current.stepDown();
      onChange(inputRef.current.value);
    }
  };

  const handleStepUp = () => {
    if (inputRef.current && !disabled) {
      inputRef.current.stepUp();
      onChange(inputRef.current.value);
    }
  };

  return (
    <div className='flex flex-col gap-2'>
      <label className='text-xs font-bold text-slate-400 uppercase tracking-wider'>{label}</label>
      <div className='relative'>
        <input
          ref={inputRef}
          type='number'
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className='bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-orange-500 outline-none disabled:opacity-50 transition shadow-inner w-full pr-20 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]'
        />
        <div className='absolute right-1 top-1/2 -translate-y-1/2 flex flex-col gap-0.5'>
          <button
            type='button'
            onClick={handleStepUp}
            disabled={disabled}
            className='border border-slate-700 rounded-t text-slate-400 hover:text-green-500 hover:border-green-500 w-8 h-4 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bold text-sm'
            title='Increase value'
            aria-label='Increase value'
          >
            +
          </button>
          <button
            type='button'
            onClick={handleStepDown}
            disabled={disabled}
            className='border border-slate-700 rounded-b text-slate-400 hover:text-orange-500 hover:border-orange-500 w-8 h-4 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bold text-sm border-t-0'
            title='Decrease value'
            aria-label='Decrease value'
          >
            −
          </button>
        </div>
      </div>
    </div>
  );
};

