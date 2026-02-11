import { type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl p-6 ${className}`}>
      {children}
    </div>
  );
};
