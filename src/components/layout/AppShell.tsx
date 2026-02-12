import { type ReactNode } from 'react';

type MaxWidth = 'sm' | 'md' | 'lg' | 'xl' | 'full';

const maxWidthClasses: Record<MaxWidth, string> = {
  sm: 'max-w-lg',
  md: 'max-w-2xl',
  lg: 'max-w-5xl',
  xl: 'max-w-7xl',
  full: 'max-w-full',
};

interface AppShellProps {
  children: ReactNode;
  /** Max width of content. Default 'xl' for practice page; 'full' for full-bleed. */
  maxWidth?: MaxWidth;
}

/**
 * App-level layout wrapper. Provides outer container, responsive padding, and max-width.
 * Shared across all future pages (Home, Profile, Skills Browser).
 */
export const AppShell = ({ children, maxWidth = 'xl' }: AppShellProps) => {
  return (
    <div className="min-h-screen w-screen bg-slate-900 flex flex-col items-center py-10 px-4 lg:px-6 overflow-y-auto scrollbar-app">
      <div className={`w-full ${maxWidthClasses[maxWidth]}`}>{children}</div>
    </div>
  );
};
