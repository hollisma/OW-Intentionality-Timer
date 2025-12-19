import { InputGroupNumber } from './InputGroupNumber';

interface InputGroupProps {
  label: string;
  value: string | number;
  type?: string;
  disabled?: boolean;
  onChange: (val: string) => void;
}

export const InputGroup = ({ label, value, type = 'text', disabled, onChange }: InputGroupProps) => {
  if (type === 'number') {
    return <InputGroupNumber label={label} value={value} disabled={disabled} onChange={onChange} />;
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