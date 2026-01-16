import { InputGroupNumber } from './InputGroupNumber';
import { InputGroupSlider } from './InputGroupSlider';

interface InputGroupProps {
  label: string;
  value: string | number;
  type?: string;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  onChange: (val: string) => void;
  formatValue?: (value: number) => string;
}

export const InputGroup = ({ label, value, type = 'text', min, max, step, disabled, onChange, formatValue }: InputGroupProps) => {
  if (type === 'number') {
    return <InputGroupNumber label={label} value={value} disabled={disabled} onChange={onChange} />;
  }

  if (type === 'slider') {
    return (
      <InputGroupSlider 
        label={label} 
        value={typeof value === 'number' ? value : parseFloat(value) || 0} 
        min={min}
        max={max}
        step={step}
        disabled={disabled} 
        onChange={onChange}
        formatValue={formatValue}
      />
    );
  }

  return (
    <div className='flex flex-col gap-2'>
      <label className='text-xs font-bold text-slate-400 uppercase tracking-wider'>{label}</label>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className='bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-orange-500 outline-none disabled:opacity-50 transition shadow-inner w-full'
      />
    </div>
  );
};